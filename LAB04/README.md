📊 Gerador de Boletos Serverless (Azure Functions + Front-end)
🎯 O que foi feito?
Desenvolvi uma aplicação completa que automatiza a geração de códigos de barras. O projeto simula um cenário real onde um sistema de faturamento precisa gerar informações de pagamento de forma rápida e segura na nuvem.

<img width="3000" height="2500" alt="image" src="https://github.com/user-attachments/assets/c18cfa45-9afd-4b48-9e8c-df1221f156c7" />

🛠️ Como foi desenvolvido? (Arquitetura)
O projeto foi dividido em duas camadas principais:

Back-end (Motor): Criado com Azure Functions (.NET 8 Isolated).

Front-end (Interface): Uma página web responsiva criada com HTML5, CSS3 e JavaScript puro.

⚙️ Funções Principais
Geração Dinâmica: Baseada em data e valor.

Validação com Feedback: Popup de sucesso via JavaScript.

Destaque Visual: Design focado em UX com suporte de CSS Flexbox.

📸 Galeria do Processo (Evidências)
1. Configuração e Integração Cloud
Neste estágio, realizei a configuração da string de conexão e o mapeamento dos endpoints no Visual Studio. É o momento em que garantimos que o "motor" da aplicação consegue se comunicar com os serviços da Microsoft Azure.


<img width="1823" height="584" alt="image" src="https://github.com/user-attachments/assets/c776d187-de5d-4ff2-b9c3-be2256783404" />


2. Back-end em Operação (Azure Functions Runtime)
Aqui vemos o console do Azure Functions em operação. Este log prova que o Worker Process foi iniciado com sucesso, as funções foram carregadas e o sistema está "ouvindo" as requisições na porta local, pronto para processar os dados enviados pelo Front-end.


<img width="1885" height="890" alt="image" src="https://github.com/user-attachments/assets/97fcc208-b977-4d4d-a34d-87adc84484c6" />



3. Front-end e Resultado Final
A prova real do projeto funcionando. O usuário preenche os campos e o sistema retorna o código de barras com o layout refinado e centralizado, destacando a sequência numérica para facilitar a leitura.



<img width="717" height="865" alt="image" src="https://github.com/user-attachments/assets/625e714c-82fb-4c9d-bcaa-6be2c48136ea" />


<img width="810" height="960" alt="image" src="https://github.com/user-attachments/assets/c58a22e9-e3fc-49c2-96c5-30bf5e2d3577" />



💡 Insights para Business Intelligence
Trabalhar neste projeto me trouxe visões valiosas para a área de dados e para a minha transição para Analista de BI:

Qualidade do Dado na Fonte: Evitando "lixo" nos relatórios finais.

Monitoramento e Governança: Possibilidade de alimentar dashboards no Power BI em tempo real.

Segurança de Dados: Gerenciamento de secrets e monitoramento de chaves sensíveis.

Desenvolvido por: Erlan Fernando Aysa Rosado
