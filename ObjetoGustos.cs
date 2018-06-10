using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectName.Objetos
{
    
    class ObjetoGustos
    {
        string gustos;

        public ObjetoGustos(string gustos) {
            this.Gustos = gustos;
        }

        public string Gustos { get => gustos; set => gustos = value; }
    }
}
