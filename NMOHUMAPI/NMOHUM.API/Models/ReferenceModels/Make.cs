using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace NMOHUM.API.Models.ReferenceModels
{
    public class Make
    {
        [Key]
        //[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MakeId { get; set; }
        public string Name { get; set; }
        public string Logo { get; set; }
        public string BamsVehicleNaming { get; set; }
        public string AutoMxVehicleNaming { get; set; }

		//public virtual ICollection<ModelType> ModelTypes { get; set; }
    }
}
