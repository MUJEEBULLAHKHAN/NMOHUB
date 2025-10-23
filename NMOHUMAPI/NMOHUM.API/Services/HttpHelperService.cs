using MySqlX.XDevAPI;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using NMOHUM.API.Models.HttpHelper;

namespace NMOHUM.API.Services
{
	public class HttpHelperService
	{
		private readonly HttpClient _httpClient;
		public HttpHelperService(HttpClient httpClient)
		{
			_httpClient = httpClient;
		}

		public async Task<HttpRequestServiceResponse> Get<T> (HttpRequestFields<T> httpRequestFields)
		{
			try
			{
				string responseBody = "";

				var request = new HttpRequestMessage(HttpMethod.Get, httpRequestFields.completeUrl);

				if (httpRequestFields.headers.Any())
				{
					foreach (var item in httpRequestFields.headers)
					{
						request.Headers.Add(item.key, item.value);
					}
				}

				var response = await _httpClient.SendAsync(request);

				if (httpRequestFields.packetType == "stream")
				{
					using (var stream = await response.Content.ReadAsStreamAsync())
					using (var decompressedSteam = new GZipStream(stream, CompressionMode.Decompress))
					using (var reader = new StreamReader(decompressedSteam, Encoding.UTF8))
					{
						responseBody = await reader.ReadToEndAsync();
					}
				}
				else
				{
					responseBody = await response.Content.ReadAsStringAsync();
				}

				var responseCode = (int)response.StatusCode;
				byte[] rawBytes = await response.Content.ReadAsByteArrayAsync();


				return new HttpRequestServiceResponse { httpResponseCode = responseCode, httpResponseBody = responseBody, rawBytes = rawBytes };
			}
			catch (Exception ex)
			{
				return new HttpRequestServiceResponse { httpResponseCode = 400, httpResponseBody = ex };
			}

		}

		public async Task<HttpRequestServiceResponse> Post<T> (HttpRequestFields<T> httpRequestFields)
		{
			try
			{
				string responseBody = "";
				HttpContent content = null;
				HttpRequestMessage request = null;

				var jsonData = JsonConvert.SerializeObject(httpRequestFields.payload);

				if(httpRequestFields.packetType == "form-url-encoded")
				{
					request = new HttpRequestMessage(HttpMethod.Post, httpRequestFields.completeUrl);


					var _content = new FormUrlEncodedContent(httpRequestFields.formParameters);
					request.Content = _content;
				}
				else
				{
					 content = new StringContent(jsonData, Encoding.UTF8, "application/json");


					 request = new HttpRequestMessage(HttpMethod.Post, httpRequestFields.completeUrl)
					{
						Content = content
					};
				}

				if (httpRequestFields.headers.Count > 0)
				{
					foreach (var header in httpRequestFields.headers)
					{
						if (!String.IsNullOrEmpty(header.key))
							request.Headers.Add(header.key, header.value);
					}
				}
				

				var response = await _httpClient.SendAsync(request);

				if (httpRequestFields.packetType == "stream")
				{
					using (var stream = await response.Content.ReadAsStreamAsync())
					using (var decompressedStream = new GZipStream(stream, CompressionMode.Decompress))
					using (var reader = new StreamReader(decompressedStream, Encoding.UTF8))
					{
						responseBody = await reader.ReadToEndAsync();
					}
				}
				else
				{
					responseBody = await response.Content.ReadAsStringAsync();
				}

				var responseCode = (int)response.StatusCode;
				var responseHeaders = response.Headers.ToDictionary(h => h.Key, h => h.Value);

				return new HttpRequestServiceResponse { httpResponseCode = responseCode, httpResponseBody = responseBody, httpHeaders = responseHeaders, httpResponseCodeText = response.StatusCode.ToString() };
			}
			catch (HttpRequestException ex)
			{
				return new HttpRequestServiceResponse { httpResponseCode = 400, httpResponseBody = ex };
			}

		}
	}
}
