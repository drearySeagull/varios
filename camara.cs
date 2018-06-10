using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class camara : MonoBehaviour {

    public GameObject personaje;
    public Vector2 minCamPos, maxCamPos;
    public float delay;

    private Vector2 velocity;

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void FixedUpdate () {
        float posX = Mathf.SmoothDamp(transform.position.x, personaje.transform.position.x, ref velocity.x, delay);
        float posY = Mathf.SmoothDamp(transform.position.y, personaje.transform.position.y + (1.5f), ref velocity.y, delay);

        transform.position = new Vector3(Mathf.Clamp(posX, minCamPos.x, maxCamPos.x),
            Mathf.Clamp(posY, minCamPos.y, maxCamPos.y), transform.position.z);
    }
}
