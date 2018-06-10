using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class arma : MonoBehaviour {

    public float tiempo;
    public GameObject personaje;
    private float velArma;
    
	// Use this for initialization
	void Start () {
        Invoke("restar", tiempo);
        velArma = Personaje.velDisparo;
    }
    
    // Update is called once per frame
    void Update () {
        transform.Translate(new Vector2(1.0f, 0) * velArma);
        if (velArma > 0) {
            GetComponent<SpriteRenderer>().flipX = true;
            //transform.Translate(Vector2.right * speed * Time.deltaTime);
        } else if(velArma < 0) {
            GetComponent<SpriteRenderer>().flipX = false;
            //transform.Translate(Vector2.left * speed * Time.deltaTime);
        }
       
        
    }

    private void OnCollisionEnter2D(Collision2D col) {
        if(col.gameObject.tag == "Enemigo") {
            SkeletoSword.vidas--;
            Personaje.disparos--;
            Destroy(gameObject, 0.05f);
        }
        
    }

    private void restar()
    {
        Personaje.disparos--;
        Destroy(gameObject);
    }

}
