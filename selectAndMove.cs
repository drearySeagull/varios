using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class selectAndMove : MonoBehaviour{
    bool moveEstructura, moveCamara;
    BoxCollider bc;
    Ray rayEstructura, rayCameraDos, rayCameraUno;
    RaycastHit hit;
    int tiempoInicial, tiempoFinal;
    GameObject flechas, objeto;
    float cameraX, cameraY, cameraZ;
    
    // Use this for initialization
    void Start(){}
    
    // Update is called once per frame
    void FixedUpdate(){
        //rayo que se usara para que al hacer click detecte el objeto al que se clico
        rayEstructura = Camera.main.ScreenPointToRay(Input.mousePosition);
        //Al pulsar el boton izquierdo del raton
        if (Input.GetMouseButtonDown(0)){
            //rayo para saber la posicion en la que se ha clicado
            rayCameraUno = Camera.main.ScreenPointToRay(Input.mousePosition);
            //Tiempo del sistema una vez clicado
            tiempoInicial = (int) Network.time;

            moveCamara = true;
            //Hace una interseccion fisica con el rayo que le pasamos 
            if (Physics.Raycast(rayEstructura, out hit)){
                //La interseccion con el colider para tener el boxcolider
                bc = hit.collider as BoxCollider;
                if (bc != null){
                    //Para coger el objeto que tiene el boxcolider seleccionado
                    objeto = bc.gameObject;
                    //Para coger el objeto hijo que tiene el objeto al que clicamos (Tienen que ser las flechas el primer hijo que tenga)
                    flechas = objeto.transform.GetChild(0).gameObject;
                    //Elevamos el objeto a 0.2 para dejar espacio a las felchas
                    objeto.transform.position = new Vector3(objeto.transform.position.x, 0.2f, objeto.transform.position.z);
                    flechas.SetActive(true);

                    moveEstructura = true;
                    moveCamara = false;
                }
            }
        }
        if(Input.GetMouseButtonUp(0)){
            //Si se levanta el boton izquierdo y se ha clicado en un objeto lo baja a la posicion 0
            if(objeto != null) {
                objeto.transform.position = new Vector3(objeto.transform.position.x, 0, objeto.transform.position.z);
                flechas.SetActive(false);
            }
            moveEstructura = false;
            moveCamara = false;
        }
        if (moveEstructura){
            //Recoger el tiempo del sistema de nuevo
            tiempoFinal = (int)Network.time;
            moverEstructura();
        }else if (moveCamara) {
            moverCamara();
        }
    }

    void moverEstructura(){
        //Si el tiempo que ha pasado es mayor a 1
        if (tiempoFinal - tiempoInicial >= 1){
            //Se coge de nuevo la posicion del rato
            rayCameraDos = Camera.main.ScreenPointToRay(Input.mousePosition);
            //Se hace la diferencia entre la primera posicion del raton y la segunda
            cameraX = rayCameraUno.origin.x - rayCameraDos.origin.x;
            cameraY = rayCameraUno.origin.y - rayCameraDos.origin.y;
            cameraZ = rayCameraUno.origin.z - rayCameraDos.origin.z;
            //La distancia que X se desplaza es la distancia entre las dos posiciones del rato en X y la mitad de la posicion del raton en Y
            int distanciaX = (int)((cameraX) + (cameraY / 2));
            int distanciaZ = (int)((cameraZ) + (cameraY / 2));
            
            //Si las distancias en la que se mueve X es mayor a 4 (valor de la posicion para rejilla) se desplaza la X
            if (Mathf.Abs(distanciaX) >= 4) {
                //Si la distancia es mayor que 0 se puede positivamente si no negativamente
                if(distanciaX > 0) {
                    objeto.transform.position = new Vector3(objeto.transform.position.x + -(4),
                                                              objeto.transform.position.y,
                                                             objeto.transform.position.z);
                }
                else {
                    objeto.transform.position = new Vector3(objeto.transform.position.x + (4),
                                                              objeto.transform.position.y,
                                                              objeto.transform.position.z);
                }
                rayCameraUno = rayCameraDos;
            }
            if (Mathf.Abs(distanciaZ) >= 4) {
                if (distanciaZ > 0) {
                    objeto.transform.position = new Vector3(objeto.transform.position.x,
                                                               objeto.transform.position.y,
                                                               objeto.transform.position.z + -(4));
                }
                else {
                    bc.gameObject.transform.position = new Vector3(objeto.transform.position.x,
                                                                   objeto.transform.position.y,
                                                                   objeto.transform.position.z + (4));
                }
                rayCameraUno = rayCameraDos;
            }
            //Si el movimiento de la Y es superior a 4, desplaza a X y Z en la misma cantidad
            if(Mathf.Abs(cameraY) >= 4) {
                if (cameraY > 0) {
                    objeto.transform.position = new Vector3(objeto.transform.position.x + -(4),
                                                              objeto.transform.position.y,
                                                               objeto.transform.position.z + -(4));
                }
                else {
                    objeto.transform.position = new Vector3(objeto.transform.position.x + (4),
                                                               objeto.transform.position.y,
                                                               objeto.transform.position.z + (4));
                }
               
                rayCameraUno = rayCameraDos;
            }
            
         /* Este funciona bn
          rayCameraDos = Camera.main.ScreenPointToRay(Input.mousePosition);
            if (rayCameraUno.origin.x - rayCameraDos.origin.x != 0 && rayCameraUno.origin.z - rayCameraDos.origin.z != 0) {
                var distanciaX = (rayCameraUno.origin.x - rayCameraDos.origin.x) + ((rayCameraUno.origin.y - rayCameraDos.origin.y) / 2);
                var distanciaZ = (rayCameraUno.origin.z - rayCameraDos.origin.z) + ((rayCameraUno.origin.y - rayCameraDos.origin.y) / 2);
                bc.gameObject.transform.position = new Vector3(bc.gameObject.transform.position.x + -(distanciaX),
                                                               bc.gameObject.transform.position.y,
                                                               bc.gameObject.transform.position.z + -(distanciaZ));
            }
            rayCameraUno = rayCameraDos;
            float distance = Vector3.Distance(new Vector3(posInicialX, 0, posInicialZ),
                new Vector3(rayEstructura.origin.x, 0, rayEstructura.origin.z));
            rayEstructura = Camera.main.ScreenPointToRay(Input.mousePosition);
            Vector3 rayPointEstructura = rayEstructura.GetPoint(distance);
            rayPointEstructura.x += (rayPointEstructura.y / 2);
            rayPointEstructura.z += (rayPointEstructura.y / 2);
            rayPointEstructura.y = 0;
            bc.gameObject.transform.position = rayPointEstructura;*/
        }
    }

    void moverCamara() {

        rayCameraDos = Camera.main.ScreenPointToRay(Input.mousePosition);
        //Se coge de nuevo la posicion del rato
        rayCameraDos = Camera.main.ScreenPointToRay(Input.mousePosition);
        //Se hace la diferencia entre la primera posicion del raton y la segunda
        cameraX = rayCameraUno.origin.x - rayCameraDos.origin.x;
        cameraY = rayCameraUno.origin.y - rayCameraDos.origin.y;
        cameraZ = rayCameraUno.origin.z - rayCameraDos.origin.z;

        if (rayCameraUno.origin.x - rayCameraDos.origin.x != 0 && rayCameraUno.origin.z - rayCameraDos.origin.z != 0) {
            var distanciaX = (cameraX) + (cameraY / 2);
            var distanciaZ = (cameraZ) + (cameraY / 2);

            gameObject.transform.position = new Vector3(gameObject.transform.position.x + distanciaX, gameObject.transform.position.y,
                                                        gameObject.transform.position.z + distanciaZ);
        }
    }

}