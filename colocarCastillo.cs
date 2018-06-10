using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class colocarCastillo : MonoBehaviour {
    
    public GameObject menuLateralIz, castillo;
    Button boton;
    Quaternion rotacion = new Quaternion(0f, 180f, 0f, 0f);
    public Button aceptar, cancelar;
    public Canvas canvas;
    
    // Use this for initialization
    void Start () {
        //Coge todos los botones que hay en la pantalla
        boton = gameObject.GetComponent<Button>();
        //Le asignas un evento click al boton
        boton.onClick.AddListener(colocar);
    }

    void colocar() {
        menuLateral();
        //Al pinchar en el castillo se crea un nuevo objeto y se coloca en la posicion,
        GameObject nuevo = Instantiate(castillo, new Vector3(150, 0, 50), rotacion);
        Vector3 v = Camera.main.WorldToScreenPoint(nuevo.transform.position);
        //tru.transform.SetParent(canvas.transform, false);
    }

    void menuLateral() {
        //Llama a la animacion del menu lateral
        if (menuLateralIz.GetComponent<Animator>().GetBool("salir")) {
            menuLateralIz.GetComponent<Animator>().SetBool("salir", false);
        }
        else {
            menuLateralIz.GetComponent<Animator>().SetBool("salir", true);
        }
    }

}
