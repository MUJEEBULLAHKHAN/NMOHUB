using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace NMOHUM.API.Models
{
    public class UserTokens
    {
        [Key]
        public long UserTokenId { get; set; }
        public string Token { get; set; }
        public DateTime TokenGeneratedDate { get; set; }
        public bool isUsed { get; set; }
        public virtual IdentityUser User { get; set; }
    }
}
