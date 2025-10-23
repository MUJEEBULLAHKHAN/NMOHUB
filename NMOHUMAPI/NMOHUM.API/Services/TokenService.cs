using Microsoft.Extensions.Configuration;
using NMOHUM.API.Models;
using RestSharp;
using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;


namespace NMOHUM.API.Services
{
    public class TokenService : ITokenService
    {
        private readonly IRestClient restClient;
        //private readonly string tokenFilePath1 = "E:\\Repository\\NMOHUB\\NMOHUM.API\\token.json";
        private readonly IConfiguration configuration;
        private static string basePath = AppDomain.CurrentDomain.BaseDirectory;
        private readonly string tokenFilePath = Path.Combine(basePath, "token.json");
        private readonly string refreshTokenFilePath = Path.Combine(basePath, "refreshtoken.json");

        public TokenService(IConfiguration configuration)
        {
            this.restClient = new RestClient("https://oauth2.googleapis.com/token");
            this.configuration = configuration;
        }

        public async Task<string> GetAccessTokenAsync()
        {
            var token = this.GetToken();
            if (token.IsTokenExpired)
            {
                token = await this.RefreshTokenAsync();
            }
            return token.access_token;
        }

        public async Task<Token> GetTokenAsync(string code)
        {
            var restRequest = new RestRequest();
            restRequest.AddQueryParameter("code", code);
            restRequest.AddQueryParameter("client_id", this.configuration.GetValue<string>("ClientId"));
            restRequest.AddQueryParameter("client_secret", this.configuration.GetValue<string>("ClientSecret"));
            restRequest.AddQueryParameter("redirect_uri", this.configuration.GetValue<string>("RedirectUrl"));
            restRequest.AddQueryParameter("grant_type", "authorization_code");
            var response = await this.restClient.PostAsync<Token>(restRequest);
            SaveToken(response);
            return response;
        }
        private async Task<Token> RefreshTokenAsync()
        {

            try
            {
                var token = this.GetToken();
                // Create a POST request targeting the token endpoint
                var restRequest = new RestRequest();
                restRequest.AddQueryParameter("refresh_token", token.refresh_token);
                restRequest.AddQueryParameter("client_id", this.configuration.GetValue<string>("ClientId"));
                restRequest.AddQueryParameter("client_secret", this.configuration.GetValue<string>("ClientSecret"));
                restRequest.AddQueryParameter("grant_type", "refresh_token");
                var response = await this.restClient.PostAsync<Token>(restRequest);
                SaveToken(response);
                return response;
            }
            catch (Exception ex)
            {

                throw;
            }
                
        }
        private void SaveToken(Token token)
        {
            System.IO.File.WriteAllText(this.tokenFilePath, JsonSerializer.Serialize(token));
        }

        private Token GetToken()
        {
            var tokenContent = System.IO.File.ReadAllText(this.tokenFilePath);
                return JsonSerializer.Deserialize<Token>(tokenContent);
        }
        private Token GetRefreshToken()
        {
            var tokenContent = System.IO.File.ReadAllText(this.refreshTokenFilePath);
            return JsonSerializer.Deserialize<Token>(tokenContent);
        }

    }
}
