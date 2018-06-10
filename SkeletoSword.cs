using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SkeletoSword : MonoBehaviour
{
    private Animator animator;
    public GameObject objetivo, rango;
    public float moveSpeed;
    private Vector2 izquierda, derecha;
    private Collider2D coli;
    //si movimiento igual false ira hacia la izquierda, si no hacia la derecha
    private bool batalla = false, movimiento = false;
    private float limitIz = 22.10f, limitDe = 26.40f;
    public static int vidas = 5;
    

    // Use this for initialization
    void Start()
    {
        izquierda = new Vector3(22f, transform.position.y, 0);
        derecha = new Vector3(26.50f, transform.position.y, 0);
        coli = rango.GetComponent<Collider2D>();
    }

    // Update is called once per frame
    void FixedUpdate()
    {
        if (batalla)
        {
            if(gameObject.transform.position.x < objetivo.transform.position.x)
            {
                transform.localScale = new Vector3(1.0f, 1.0f, 1.0f);
            }
            else
            {
                transform.localScale = new Vector3(-1.0f, 1.0f, 1.0f);
            }
            transform.position = Vector3.MoveTowards(gameObject.transform.position, objetivo.transform.position, moveSpeed * Time.deltaTime);
        }
        else
        {
            if (transform.position.x > limitDe)
            {
                transform.position = Vector3.MoveTowards(gameObject.transform.position, izquierda, moveSpeed * Time.deltaTime);
                transform.localScale = new Vector3(-1.0f, 1.0f, 1.0f);
                movimiento = false;
            }
            else if (transform.position.x < limitIz)
            {
                transform.position = Vector3.MoveTowards(gameObject.transform.position, derecha, moveSpeed * Time.deltaTime);
                transform.localScale = new Vector3(1.0f, 1.0f, 1.0f);
                movimiento = true;

            }
            if(movimiento)
            {
                transform.position = Vector3.MoveTowards(gameObject.transform.position, derecha, moveSpeed * Time.deltaTime);
                transform.localScale = new Vector3(1.0f, 1.0f, 1.0f);
            }
            else
            {
                transform.position = Vector3.MoveTowards(gameObject.transform.position, izquierda, moveSpeed * Time.deltaTime);
                transform.localScale = new Vector3(-1.0f, 1.0f, 1.0f);
            }
        }
        if(vidas == 0)
        {
            Destroy(gameObject);
        }
       
        
        if (coli.IsTouching(objetivo.GetComponent<Collider2D>()))
        {
            batalla = true;
        }
        else
        {
            batalla = false;
        }
        
    }

    private void OnCollisionEnter2D(Collision2D col)
    {
        if (col.gameObject.name == "Saitama")
        {
            gameObject.GetComponent<Animator>().SetBool("ataque", true);
        }
        
    }

    private void OnCollisionExit2D(Collision2D col)
    {
        if (col.gameObject.name == "Saitama")
        {
            // animator.SetBool("ataque", false);
            gameObject.GetComponent<Animator>().SetBool("ataque", false);
        }
    }



}
