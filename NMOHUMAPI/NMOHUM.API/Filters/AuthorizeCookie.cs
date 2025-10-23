using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;

namespace NMOHUM.API.Filters
{
    public class AuthorizeCookie : Attribute, IActionFilter
    {
        private string[] _roles { get; set; }
        public AuthorizeCookie(string[] roles)
        {
            _roles = roles;
        }

        //protected override 
        public void OnActionExecuted(ActionExecutedContext context)
        {

        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            var stream = context.HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(stream) as JwtSecurityToken;
            //var tokenS = handler.ReadToken() as JwtSecurityToken;
            //var b = jsonToken.Claims.Where(c => c.Value == "Roles");
            string roles =JsonConvert.SerializeObject(jsonToken.Payload["Roles"]);
            foreach (var input in _roles)
            {
                if (roles.Contains(input,StringComparison.OrdinalIgnoreCase))
                {
                    return;
                }
            }
            context.Result = new JsonResult(HttpStatusCode.Unauthorized);
        }
    }
}
