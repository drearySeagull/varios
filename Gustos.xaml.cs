namespace ProjectName {
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Gustos : ContentPage {
        private string vari1, vari2, vari3, vari4, vari5, vari6;
        private ObjetoError error;
        private ObjetoGustosCompletos gustosCompletos;

        public Gustos() {
            InitializeComponent();
            //Que recoja los datos de la bd
            datosErrorGustos("query" + Application.Current.Properties["id"]);
        }
        
        async protected override void OnDisappearing() {
            if (String.IsNullOrEmpty(var1Edit.ToString()) && String.IsNullOrEmpty(var2Edit.ToString()) && String.IsNullOrEmpty(var3Edit.ToString()) && String.IsNullOrEmpty(var4Edit.ToString()) && String.IsNullOrEmpty(var5Edit.ToString())) {
                vari1 = var1Edit.Text;
                vari1 = vari1.Replace(" ", "%20");
                vari2 = var2Edit.Text;
                vari2 = vari2.Replace(" ", "%20");
                vari3 = var3Edit.Text;
                vari3 = vari3.Replace(" ", "%20");
                vari4 = var4Edit.Text;
                vari4 = vari4.Replace(" ", "%20");
                vari5 = var5Edit.Text;
                vari5 = vari5.Replace(" ", "%20");
                vari6 = acuarela.Text;
                vari6 = vari6.Replace(" ", "%20");

                init("query&id=" + Application.Current.Properties["id"]);
            } else {
                await Navigation.PushAsync(new MainPage());
            }
        }
        
        async void init(string query) {

            Task<List<ObjetoError>> pl = ConsultaGustos.actualizaGustos(query);
            List<ObjetoError> p = await pl;
            error = p[0];

            if (error.Status.Equals("correcto")) {
                DependencyService.Get<IMessage>().LongAlert(error.Mensaje);

                await Navigation.PushAsync(new MainPage());
            } else {
                DependencyService.Get<IMessage>().LongAlert(error.Mensaje);
            }
        }
        async void datosErrorGustos(string query) {

            do {
                Task<List<ObjetoError>> pl = ConsultaGustos.errorMisGustos(query);
                List<ObjetoError> p = await pl;
                error = p[0];
            } while (error.Status.Equals("fallo"));
            datosGustos("query&id=" + Application.Current.Properties["id"]);
        }

        async void datosGustos(string query) {
            Task<List<ObjetoGustosCompletos>> pl = ConsultaGustos.misGustos(query);
            List<ObjetoGustosCompletos> p = await pl;
            gustosCompletos = p[0];

            var1Edit.Text = gustosCompletos.Primero;
            var2Edit.Text = gustosCompletos.Segundo;
            var3Edit.Text = gustosCompletos.Tercero;
            var4Edit.Text = gustosCompletos.Cuarto;
            var5Edit.Text = gustosCompletos.Quinto;
            acuarela.Text = gustosCompletos.Sexto;
        }
    }
}