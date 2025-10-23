using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NMOHUM.API.Services;
using System.Threading.Tasks;

namespace NMOHUM.API.Controllers
{
    public class OauthController : Controller
    {
        IConfiguration configuration;
        ITokenService tokenService;
        public OauthController(IConfiguration configuration, ITokenService tokenService)
        {
            this.configuration = configuration;
            this.tokenService = tokenService;
        }
        public IActionResult Authorize()
        {
            var url = "https://accounts.google.com/o/oauth2/v2/auth?" +
                $"scope={this.configuration.GetValue<string>("Scope")}" +
                $"&access_type=offline" +
                $"&response_type=code" +
                $"&state=themessydeveloper" +
                $"&redirect_uri={this.configuration.GetValue<string>("RedirectUrl")}" +
                $"&client_id={this.configuration.GetValue<string>("ClientId")}";

            return Redirect(url);
        }
        public async Task Callback(string code, string state)
        {
            await this.tokenService.GetTokenAsync(code);
        }
    }
}
