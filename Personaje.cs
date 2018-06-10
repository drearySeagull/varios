using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Tilemaps;
using UnityEngine.UI;

public class Personaje : MonoBehaviour
{
    bool escaleras = false, bajas = false, enSuelo = false;
    public Tilemap finEscaleras;
    GameObject enemigo;
    public GameObject arma;
    private Animator animator;
    public float salto = 350f, speed = 10f;
    private int vidas = 3;
    public Image corazones;
    public Sprite[] vidasImg;
    private float toke1 = 3, toke2 = 2;
    private int maxDisparos = 2;
    public static int disparos = 0;
    public static float velDisparo;
    //heartshealth_10 -15 -20- 25

    // Use this for initialization
    void Start()
    {
        animator = GetComponent<Animator>();
    }

    private void Update() {
        if (disparos < 2)
        {
            if (Input.GetKeyDown("o")) {
            
                if (gameObject.transform.localScale.x > 0)
                {
                    Instantiate(arma, new Vector2(transform.position.x + 1f, transform.position.y + 0.5f), Quaternion.identity);
                    velDisparo = 0.1f;
                    //Instantiate(arma, new Vector3(gameObject.transform.position.x + 1f, gameObject.transform.position.y + 0.5f, gameObject.transform.position.z), Quaternion.identity);
                    disparos++;
                }
                else
                {
                    Instantiate(arma, new Vector2(transform.position.x - 1f, transform.position.y + 0.5f), Quaternion.identity);
                    velDisparo = -0.1f;
                    //Instantiate(arma, new Vector3(gameObject.transform.position.x - 1f, gameObject.transform.position.y + 0.5f, gameObject.transform.position.z), Quaternion.identity);
                    disparos++;
                }
            }
        }
    }


    // Update is called once per frame
    void FixedUpdate(){

        if (escaleras) {
            if (Input.GetKey("w")) {
                gameObject.GetComponent<Rigidbody2D>().constraints = RigidbodyConstraints2D.None | RigidbodyConstraints2D.FreezeRotation;
                gameObject.GetComponent<Rigidbody2D>().velocity = new Vector2(0, 5);
                animator.SetBool("salto", false);
            }
            else if (Input.GetKeyUp("w")) {
                gameObject.GetComponent<Rigidbody2D>().constraints = RigidbodyConstraints2D.FreezePositionY | RigidbodyConstraints2D.FreezeRotation;
            }
            if (Input.GetKey("s")) {
                if (bajas) {
                    finEscaleras.gameObject.GetComponent<Collider2D>().isTrigger = true;
                }
                gameObject.GetComponent<Rigidbody2D>().constraints = RigidbodyConstraints2D.None | RigidbodyConstraints2D.FreezeRotation;
                gameObject.GetComponent<Rigidbody2D>().velocity = new Vector2(0, -5);

            } else if (Input.GetKeyUp("s")) {
                gameObject.GetComponent<Rigidbody2D>().constraints = RigidbodyConstraints2D.FreezePositionY | RigidbodyConstraints2D.FreezeRotation;
            }
        }
        
        if (Input.GetKey("a") && enSuelo) {
            //gameObject.GetComponent<Rigidbody2D>().velocity = new Vector2(-5, 0);
            transform.Translate(Vector2.left * speed * Time.deltaTime);
            animator.SetBool("movimiento", true);
            transform.localScale = new Vector3(-3.0f, 3.0f, 1.0f);
        } else if (Input.GetKey("a") && !enSuelo) {
            transform.Translate(Vector2.left * speed * Time.deltaTime);
            animator.SetBool("movimiento", false);
            animator.SetBool("salto", true);
            transform.localScale = new Vector3(-3.0f, 3.0f, 1.0f);
        }
        if (Input.GetKeyUp("a") || Input.GetKeyUp("d"))
        {
            animator.SetBool("movimiento", false);
        }
        if (Input.GetKey("d") && enSuelo){
            //gameObject.GetComponent<Rigidbody2D>().velocity = new Vector2(5, 0);
            transform.Translate(Vector2.right * speed * Time.deltaTime);
            animator.SetBool("movimiento", true);
            transform.localScale = new Vector3(3.0f, 3.0f, 1.0f);

        } else if(Input.GetKey("d") && !enSuelo) {
            transform.Translate(Vector2.right * speed * Time.deltaTime);
            animator.SetBool("movimiento", false);
            animator.SetBool("salto", true);
            transform.localScale = new Vector3(3.0f, 3.0f, 1.0f);
        }
        if (Input.GetKey("s")) {
            transform.Translate(Vector2.down * speed * Time.deltaTime);
        }
        if (Input.GetKey("w") && enSuelo)
        {
            gameObject.GetComponent<Rigidbody2D>().constraints = RigidbodyConstraints2D.None | RigidbodyConstraints2D.FreezeRotation;
            gameObject.GetComponent<Rigidbody2D>().velocity = new Vector2(0, salto);
            animator.SetBool("salto", true);
            animator.SetBool("movimiento", false);
        }

        switch (vidas) {
            case 3:
                corazones.sprite = vidasImg[0];
                break;
            case 2:
                corazones.sprite = vidasImg[1];
                break;
            case 1:
                corazones.sprite = vidasImg[2];
                break;
            case 0:
                corazones.sprite = vidasImg[3];
                vidas = 3;
                //Poner animacion de muerte y oscurecimiento de pantalla/Menu principal
                break;
        }

    }

    private void OnCollisionEnter2D(Collision2D col){
        if (col.gameObject.name == "finEscalera")
        {
            bajas = true;
            animator.SetBool("salto", false);
        }

        if (col.gameObject.tag == "Suelos")
        {
            animator.SetBool("salto", false);
            enSuelo = true;
        }

        if(col.gameObject.tag == "Enemigo") {
            vidas--;
            enemigo = GameObject.FindWithTag("Enemigo");

            if(enemigo.transform.position.x > gameObject.transform.position.x) {
                gameObject.GetComponent<Rigidbody2D>().velocity = new Vector2(-toke1, toke2);
            } else {
                gameObject.GetComponent<Rigidbody2D>().velocity = new Vector2(toke1, toke2);
            }
        }

    }
    private void OnCollisionExit2D(Collision2D col){
        
        if (col.gameObject.name == "Suelos")
        {
            enSuelo = false;
        }
    }
    //Si se usa oncollision se tiene que poner colission
    //Si se usa ontrigger se tiene que poner collider
    private void OnTriggerEnter2D(Collider2D col) {
        if (col.gameObject.name == "Escaleras") {
            escaleras = true;
        }
    }
    
    private void OnTriggerExit2D(Collider2D col) {
        if (col.gameObject.name == "Escaleras") {
            escaleras = false;
            gameObject.GetComponent<Rigidbody2D>().constraints = RigidbodyConstraints2D.None | RigidbodyConstraints2D.FreezeRotation;
            finEscaleras.gameObject.GetComponent<Collider2D>().isTrigger = false;
        }
        if (col.gameObject.name == "finEscalera" && escaleras) {
            bajas = false;
        }
    }

   


}
