class AgentService:

    async def process_message(self, message: str) -> str:
        """
        Processa uma mensagem enviada pelo usuário.

        Futuramente este serviço será responsável por:
        - chamar o modelo de IA
        - utilizar ferramentas
        - consultar memória
        - acessar documentos
        - realizar pesquisas
        - consultar informações do computador
        """

        message = message.strip()

        if not message:
            return "Não recebi nenhuma mensagem."

        return (
            f"Recebi sua mensagem: '{message}'. "
            "Meu sistema de IA ainda está sendo configurado."
        )


agent_service = AgentService()