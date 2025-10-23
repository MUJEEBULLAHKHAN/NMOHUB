using System.Collections.Generic;

namespace NMOHUM.API.Models
{

    public class Invoice
    {
        public class Model1
        {
            public string terms { get; set; }
            public string sales_man { get; set; }
            public string customer_ref { get; set; }
            public int customer_id { get; set; }
            public string customer_name { get; set; }
            public string customer_address { get; set; }
            public string customer_city { get; set; }
            public string customer_contact_name { get; set; }
            public string customer_contact_tel { get; set; }
            public string customer_postal_code { get; set; }
            public string customer_vat_number { get; set; }
            public int seller_id { get; set; }
            public string seller_name { get; set; }
            public string seller_address { get; set; }
            public string seller_city { get; set; }
            public string seller_contact_name { get; set; }
            public string seller_contact_tel { get; set; }
            public string seller_postal_code { get; set; }
            public string seller_vat_number { get; set; }
            public string seller_IBAN { get; set; }
            public object seller_logo { get; set; }
            public bool line_item { get; set; }
        }

        public class Model2
        {

            public string item_code { get; set; }
            public string item_name { get; set; }
            public string pack { get; set; }
            public string quantity { get; set; }
            public string unit_price { get; set; }
            public string discount { get; set; }
            public string item_sub_total_including_vat { get; set; }
        }

        public class Model3
        {
            public string total_excluding_vat { get; set; }
            public string total_discount { get; set; }
            public string net_excluding_VAT { get; set; }
            public string total_vat_15perc { get; set; }
            public string net_amount { get; set; }
            public string total_amount_due { get; set; }
            public string remarks { get; set; }
        }

        public class InvoiceModel
        {


            public Model1 model1 { get; set; }
            public List<Model2> model2 { get; set; }
            public Model3 model3 { get; set; }
        }

    }
}
