using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace ProjectName.Consultas
{
    class ConsultaGustos
    {
        public async static Task<List<ObjetoGustos>> getJsonGustosSimilares(String url) {
            using (HttpClient client = new HttpClient()) {

                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                //Using https to satisfy iOS ATS requirements
                var response = await client.GetAsync(new Uri(url)).ConfigureAwait(continueOnCapturedContext: false);

                //response.EnsureSuccessStatusCode(); //I was playing around with this to see if it makes any difference
                if (response.IsSuccessStatusCode) {
                    var content = await response.Content.ReadAsStringAsync();
                    //categoryLinks = JsonConvert.DeserializeObject<IEnumerable<Link>>(content);

                    List<ObjetoGustos> msg = JsonConvert.DeserializeObject<List<ObjetoGustos>>(content);

                    System.Diagnostics.Debug.WriteLine("Contenido del json: " + content);

                    return msg;
                } else {
                    System.Diagnostics.Debug.WriteLine("Error consulta localizacion");
                    return null;
                }
            }
        }

        public async static Task<List<ObjetoError>> actualizaGustos(String url) {
            using (HttpClient client = new HttpClient()) {

                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                //Using https to satisfy iOS ATS requirements
                var response = await client.GetAsync(new Uri(url)).ConfigureAwait(continueOnCapturedContext: false);

                //response.EnsureSuccessStatusCode(); //I was playing around with this to see if it makes any difference
                if (response.IsSuccessStatusCode) {
                    var content = await response.Content.ReadAsStringAsync();
                    //categoryLinks = JsonConvert.DeserializeObject<IEnumerable<Link>>(content);

                    List<ObjetoError> msg = JsonConvert.DeserializeObject<List<ObjetoError>>(content);

                    System.Diagnostics.Debug.WriteLine("Contenido del json: " + content);

                    return msg;
                } else {
                    System.Diagnostics.Debug.WriteLine("Error consulta localizacion");
                    return null;
                }
            }
        }
    }
}
