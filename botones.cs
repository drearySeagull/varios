using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class botones : MonoBehaviour {

    string nombre;
    Button boton;
    public GameObject menuLateralIz;
    
    // Use this for initialization
    void Start () {
        nombre = gameObject.name;
        //Al empezar te coge los botones del canvas
        boton = gameObject.GetComponent<Button>();
        //poner un switch con el nombre y llamar a la funcion que toque dependiendo del boton
        Debug.Log(nombre);
        switch (nombre) {
            case "MenuButton":
                boton.onClick.AddListener(menuLateral);

                break;
            case "Menu":
                boton.onClick.AddListener(go2);
                break;
        }
        
	}

    // Update is called once per frame
    void Update() { }

    void menuLateral() {
        //Activa la animacion del menu lateral
        if (menuLateralIz.GetComponent<Animator>().GetBool("salir")){
            menuLateralIz.GetComponent<Animator>().SetBool("salir", false);
        }
        else {
            menuLateralIz.GetComponent<Animator>().SetBool("salir", true);
        }
        


    }
    void go2() {
        Debug.Log("adios");
    }
}
