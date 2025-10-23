using System.Collections.Generic;

namespace NMOHUM.API.Models.HttpHelper
{
	public class HttpRequestFields<T>
	{
		public string baseUrl { get; set; }
		public string completeUrl { get; set; }
		public string method { get; set; }
		public Dictionary<string, string> formParameters { get; set; }
		public List<HttpRequestHeaders> headers { get; set; }
		public T payload { get; set; }
		public string packetType { get; set; }

	}
	public class HttpRequestHeaders
	{
		public string key { get; set; }
		public string value { get; set; }
	}

	public class HttpRequestServiceResponse
	{
		public int httpResponseCode { get; set; }
		public string httpResponseCodeText { get; set; }
		public object httpResponseBody { get; set; }
		public Dictionary<string, IEnumerable<string>> httpHeaders { get; set; }
		public byte[] rawBytes { get; set; }
	}
}
