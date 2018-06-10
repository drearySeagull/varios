using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectName.Objetos
{
    class ObjetoError
    {
        string status;
        string mensaje;

        public ObjetoError(string status, string mensaje)
        {
            Status = status;
            Mensaje = mensaje;
        }

        public string Status { get => status; set => status = value; }
        public string Mensaje { get => mensaje; set => mensaje = value; }
    }
}
