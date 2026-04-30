using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace fnValidaBoleto;

public class Function1
{
    private readonly ILogger<Function1> _logger;

    public Function1(ILogger<Function1> logger)
    {
        _logger = logger;
    }

    [Function("barcode-validate")]

    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest req)
    {
        string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
        dynamic data = JsonConvert.DeserializeObject(requestBody);
        string barcode = data?.barcode;

        if (string.IsNullOrEmpty(barcode))
        {
            return new BadRequestObjectResult("O campo barcode é obrigatório");
        }

        if (barcode.Length != 44)
        {
            var result = new { valido = false, mensagem = "O campo barcode deve conter exatamente 44 dígitos numéricos" };
            return new BadRequestObjectResult(result);
        }

        string datePart = barcode.Substring(3, 8);
        if (!DateTime.TryParseExact(datePart, "yyyyMMdd", null, System.Globalization.DateTimeStyles.None, out DateTime dateObj))
        {
            var result = new { valido = false, mensagem = "Data de Vencimento Inválida" };
            return new BadRequestObjectResult(result);
        }

        var okResult = new { valido = true, mensagem = "Boleto válido",vencimento = dateObj.ToString("dd-MM-yyyy") };
        return new OkObjectResult(okResult);
    }
}