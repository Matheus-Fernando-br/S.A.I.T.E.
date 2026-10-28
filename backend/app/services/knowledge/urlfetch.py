"""Download seguro de páginas para a base de conhecimento.

Proteções contra SSRF:
- apenas http/https, sem credenciais na URL e em portas web comuns;
- o host é resolvido e TODOS os endereços precisam ser públicos (bloqueia
  loopback, redes privadas, link-local/metadados de nuvem, multicast, reservados);
- a conexão é feita no IP já validado (Host/SNI preservados), o que impede
  *DNS rebinding* entre a validação e a conexão;
- redirecionamentos são seguidos manualmente e revalidados a cada salto;
- tamanho, tempo e tipos de conteúdo são limitados.
Não tenta contornar autenticação ou paywalls: respostas 401/403 são relatadas.
"""

import asyncio
import ipaddress
import socket
from dataclasses import dataclass
from urllib.parse import urljoin, urlsplit, urlunsplit

import httpx


class URLFetchError(ValueError):
    pass


ALLOWED_PORTS = {80, 443, 8080, 8443}
MAX_REDIRECTS = 5
TIMEOUT_SECONDS = 15.0
ALLOWED_TYPES = {
    "text/html": ".html",
    "application/xhtml+xml": ".html",
    "text/plain": ".txt",
    "text/markdown": ".md",
    "text/csv": ".csv",
    "application/pdf": ".pdf",
}
USER_AGENT = "SAITE-Learn/1.0 (+assistente pessoal local; respeita robots e paywalls)"


@dataclass
class FetchedResource:
    url: str
    final_url: str
    content_type: str
    suffix: str
    data: bytes


def is_public_ip(address: str) -> bool:
    ip = ipaddress.ip_address(address)
    if isinstance(ip, ipaddress.IPv6Address) and ip.ipv4_mapped:
        ip = ip.ipv4_mapped
    return ip.is_global and not ip.is_multicast and not ip.is_reserved


def validate_url(url: str) -> tuple[str, str, int]:
    """Valida a forma da URL. Retorna (url normalizada, host, porta)."""
    if not isinstance(url, str) or len(url) > 2048:
        raise URLFetchError("URL inválida.")
    parts = urlsplit(url.strip())
    if parts.scheme not in {"http", "https"}:
        raise URLFetchError("Apenas URLs http:// ou https:// são aceitas.")
    if parts.username or parts.password:
        raise URLFetchError("URLs com usuário/senha não são aceitas.")
    host = parts.hostname
    if not host:
        raise URLFetchError("URL sem host.")
    try:
        port = parts.port or (443 if parts.scheme == "https" else 80)
    except ValueError as exc:
        raise URLFetchError("Porta inválida.") from exc
    if port not in ALLOWED_PORTS:
        raise URLFetchError(f"Porta {port} não permitida.")
    if host.endswith((".local", ".internal", ".localhost")) or host == "localhost":
        raise URLFetchError("Endereços locais ou internos não são permitidos.")
    normalized = urlunsplit((parts.scheme, parts.netloc, parts.path or "/", parts.query, ""))
    return normalized, host, port


async def resolve_public(host: str, port: int) -> str:
    """Resolve o host e exige que todos os endereços sejam públicos. Retorna um IP."""
    try:
        ipaddress.ip_address(host)
        addresses = [host]
    except ValueError:
        loop = asyncio.get_running_loop()
        try:
            infos = await loop.getaddrinfo(host, port, type=socket.SOCK_STREAM)
        except socket.gaierror as exc:
            raise URLFetchError(f"Não foi possível resolver o endereço '{host}'.") from exc
        addresses = sorted({info[4][0] for info in infos})
    if not addresses:
        raise URLFetchError(f"Não foi possível resolver o endereço '{host}'.")
    for address in addresses:
        if not is_public_ip(address):
            raise URLFetchError("O endereço aponta para uma rede privada ou interna e foi bloqueado.")
    return addresses[0]


async def fetch_url(url: str, max_bytes: int) -> FetchedResource:
    current = url
    async with httpx.AsyncClient(
        timeout=httpx.Timeout(TIMEOUT_SECONDS, connect=5.0),
        follow_redirects=False,
        trust_env=False,
    ) as client:
        for _ in range(MAX_REDIRECTS + 1):
            normalized, host, port = validate_url(current)
            ip = await resolve_public(host, port)
            parts = urlsplit(normalized)
            ip_host = f"[{ip}]" if ":" in ip else ip
            pinned = urlunsplit((parts.scheme, f"{ip_host}:{port}", parts.path, parts.query, ""))
            request = client.build_request(
                "GET",
                pinned,
                headers={
                    "Host": parts.netloc,
                    "User-Agent": USER_AGENT,
                    "Accept": ", ".join(ALLOWED_TYPES),
                },
                extensions={"sni_hostname": host} if parts.scheme == "https" else {},
            )
            try:
                response = await client.send(request, stream=True)
            except httpx.TimeoutException as exc:
                raise URLFetchError("Tempo de resposta esgotado ao acessar a página.") from exc
            except httpx.HTTPError as exc:
                raise URLFetchError(f"Falha de conexão: {type(exc).__name__}.") from exc
            try:
                if response.is_redirect:
                    location = response.headers.get("location")
                    if not location:
                        raise URLFetchError("Redirecionamento sem destino.")
                    current = urljoin(normalized, location)
                    continue
                if response.status_code in {401, 403}:
                    raise URLFetchError(
                        "A página exige autenticação ou bloqueou o acesso. "
                        "Baixe o conteúdo manualmente e importe-o como arquivo."
                    )
                if response.status_code >= 400:
                    raise URLFetchError(f"A página respondeu com erro HTTP {response.status_code}.")
                content_type = response.headers.get("content-type", "").split(";")[0].strip().lower()
                if content_type not in ALLOWED_TYPES:
                    raise URLFetchError(f"Tipo de conteúdo não suportado: {content_type or 'desconhecido'}.")
                declared = response.headers.get("content-length")
                if declared and declared.isdigit() and int(declared) > max_bytes:
                    raise URLFetchError("Conteúdo maior que o limite permitido.")
                body = bytearray()
                async for piece in response.aiter_bytes():
                    body.extend(piece)
                    if len(body) > max_bytes:
                        raise URLFetchError("Conteúdo maior que o limite permitido.")
                return FetchedResource(
                    url=url,
                    final_url=normalized,
                    content_type=content_type,
                    suffix=ALLOWED_TYPES[content_type],
                    data=bytes(body),
                )
            finally:
                await response.aclose()
    raise URLFetchError("Redirecionamentos demais.")
