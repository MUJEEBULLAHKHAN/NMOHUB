using System;

namespace NMOHUM.API.Models
{
    public class Token
    {
        public Token()
        {
            this.GeneratedOn = DateTime.Now;
        }

        public string access_token { get; set; }
        public int expires_in { get; set; }
        public string token_type { get; set; }
        public string scope { get; set; }
        public string refresh_token { get; set; }
        public DateTime GeneratedOn { get; set; }

        public bool IsTokenExpired
        {
            get
            {
                //return false;
                return this.GeneratedOn.AddSeconds(this.expires_in) <= DateTime.Now;
            }
        }
    }
}
