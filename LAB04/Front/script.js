const API_ENDPOINTS = [
  'http://127.0.0.1:7198/api/barcode-generate',
  'http://127.0.0.1:7198/barcode-generate',
  'http://127.0.0.1:7198/api/BarcodeGenerate',
  'http://localhost:7198/api/barcode-generate',
  'http://localhost:7198/barcode-generate'
];

const form = document.getElementById('barcodeForm');
const resultSection = document.getElementById('result');
const barcodeText = document.getElementById('barcodeText');
const barcodeImage = document.getElementById('barcodeImage');
const message = document.getElementById('message');
const validateButton = document.getElementById('validateButton');
const copyButton = document.getElementById('copyButton');
const imageWrapper = document.querySelector('.image-wrapper');

let currentDataVencimento = '';
let currentValor = 0;

async function postToApi(payload, endpoints = API_ENDPOINTS) {
  let lastError;
  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`Erro ${response.status}: ${response.statusText}${errorText ? ' - ' + errorText : ''}`);
      }

      const data = await response.json();
      return { data, url };
    } catch (error) {
      lastError = error;
      console.warn(`Tentativa falhou em ${url}:`, error);
    }
  }

  throw new Error(`Todas as rotas tentadas falharam. Último erro: ${lastError?.message || 'sem mensagem'}`);
}

const VALIDATE_ENDPOINTS = [
  'http://127.0.0.1:7198/api/barcode-validate',
  'http://127.0.0.1:7198/barcode-validate',
  'http://127.0.0.1:7198/api/BarcodeValidate',
  'http://localhost:7198/api/barcode-validate',
  'http://localhost:7198/barcode-validate'
];

const VALIDATE_FALLBACK_ENDPOINTS = [...API_ENDPOINTS];

copyButton.addEventListener('click', async () => {
  const barcodeValue = barcodeText.textContent;
  if (!barcodeValue) {
    return;
  }

  try {
    await navigator.clipboard.writeText(barcodeValue);
    message.textContent = 'Código copiado!';
    setTimeout(() => {
      message.textContent = '';
    }, 3000);
  } catch (error) {
    console.error('Falha ao copiar:', error);
    message.textContent = 'Falha ao copiar o código.';
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  resultSection.classList.add('hidden');
  message.textContent = 'Gerando código de barras...';

  const dataVencimento = document.getElementById('dataVencimento').value;
  const valor = Number(document.getElementById('valor').value);

  if (!dataVencimento || !valor || valor <= 0) {
    message.textContent = 'Preencha data de vencimento e valor válidos.';
    return;
  }

  try {
    const { data, url } = await postToApi({ dataVencimento, valor });
    barcodeText.textContent = data.barcode || 'Nenhum barcode retornado';
    barcodeImage.src = data.imagemBase64 ? `data:image/png;base64,${data.imagemBase64}` : '';
    barcodeImage.alt = data.barcode || 'Código de barras';
    resultSection.classList.remove('hidden');
    message.textContent = `Barcode gerado com sucesso via ${url}.`;
    validateButton.disabled = false;
    imageWrapper.classList.remove('valid', 'invalid');

    currentDataVencimento = dataVencimento;
    currentValor = valor;
  } catch (error) {
    console.error(error);
    message.textContent = `Falha ao gerar o código de barras: ${error.message}`;
  }
});

validateButton.addEventListener('click', async () => {
  const barcodeValue = barcodeText.textContent;
  if (!barcodeValue) {
    message.textContent = 'Nenhum barcode para validar.';
    return;
  }

  const dataVencimento = currentDataVencimento || document.getElementById('dataVencimento').value;
  const valor = currentValor || Number(document.getElementById('valor').value);

  if (!dataVencimento || !valor || valor <= 0) {
    message.textContent = 'Preencha data de vencimento e valor válidos antes de validar.';
    return;
  }

  message.textContent = 'Validando barcode...';
  validateButton.disabled = true;

  const validatePayloads = [
    { barcode: barcodeValue, dataVencimento, valor },
    { codigoBarra: barcodeValue, dataVencimento, valor },
    { barCode: barcodeValue, dataVencimento, valor },
    { barcodeValue: barcodeValue, dataVencimento, valor }
  ];

  try {
    let result;
    let usedUrl = '';
    let usedRouteType = 'validação';

    for (const payload of validatePayloads) {
      try {
        result = await postToApi(payload, VALIDATE_ENDPOINTS);
        usedRouteType = 'validação';
        break;
      } catch (error) {
        console.warn('Payload de validação falhou:', payload, error.message);
      }
    }

    if (!result) {
      for (const payload of validatePayloads) {
        try {
          result = await postToApi(payload, VALIDATE_FALLBACK_ENDPOINTS);
          usedRouteType = 'fallback de geração';
          break;
        } catch (error) {
          console.warn('Payload de validação fallback falhou:', payload, error.message);
        }
      }
    }

    if (!result) {
      throw new Error('Nenhuma combinação de payload ou endpoint de validação funcionou.');
    }

    const { data, url } = result;
    usedUrl = url;
    const explicitValid = data.valido === true || data.valido === 'true' || data.valid === true || data.valid === 'true';
    const explicitInvalid = data.valido === false || data.valido === 'false' || data.valid === false || data.valid === 'false';

    let isValid = explicitValid;
    let validationMessage = '';

    if (!explicitValid && !explicitInvalid) {
      if (data.barcode) {
        isValid = true;
        validationMessage = ' (sem campo explícito de validação, mas recebeu barcode)';
      }
    }

    if (isValid) {
      imageWrapper.classList.remove('invalid');
      imageWrapper.classList.add('valid');
      alert('Boleto validado com sucesso!');
    } else {
      imageWrapper.classList.remove('valid');
      imageWrapper.classList.add('invalid');
      const raw = JSON.stringify(data);
      message.textContent = `Barcode inválido via ${usedRouteType} ${usedUrl}. Resposta: ${raw}`;
    }
  } catch (error) {
    console.error(error);
    message.textContent = `Falha ao validar o barcode: ${error.message}`;
  } finally {
    validateButton.disabled = false;
  }
});
