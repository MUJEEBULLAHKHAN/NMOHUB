using NMOHUM.API.Models;
using System.Threading.Tasks;

namespace NMOHUM.API.Services
{
    public interface ITokenService
    {
        Task<Token> GetTokenAsync(string code);
        Task<string> GetAccessTokenAsync();
    }
}
