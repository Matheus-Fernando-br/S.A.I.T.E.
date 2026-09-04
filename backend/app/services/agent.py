import os

from openai import AsyncOpenAI


class AgentService:

    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=os.getenv("OPENAI_API_KEY")
        )

        self.model = os.getenv(
            "OPENAI_MODEL",
            "gpt-5.6-luna"
        )

    async def process_message(
        self,
        message: str
    ) -> str:

        message = message.strip()

        if not message:
            return "Não recebi nenhuma mensagem."

        response = await self.client.responses.create(
            model=self.model,
            instructions="""
Você é Athena, a inteligência artificial pessoal do projeto S.A.I.T.E.

Seu objetivo é ajudar o usuário de forma clara, objetiva e inteligente.

Características:
- Responda em português por padrão.
- Seja direta, mas explique quando necessário.
- Não invente informações.
- Quando estiver escrevendo código, forneça código funcional.
- Considere que você faz parte do sistema S.A.I.T.E.
""",
            input=message,
        )

        return response.output_text


agent_service = AgentService()