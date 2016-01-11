# ProjectWater
WebGL Water simulation


## Notes

Comment faire mieux?

Utiliser un seul quad(V1,V2,V3,V4).

Créer un tableau de points PressionGrid[number]/(matrice?), les limites sont V1,V2,V3,V4, 
faudrait diviser en sous parties (comme je fais pour mon water plane).

Ensuite, faire une fonction JS pour deformer la matrice selon un click 
(appliquer une pression de 250 par example).
Boucle for x for y et calculer cela pour les voisins.
Cette grille, la passer en uniform -> c'est une 'texture' donc.

Uniforms: LightRay, CamerePosition (mvMatrix), PressionGrid

Vertex shader    -> recuper la position, la passer en varying.
                    Ne rien faire d'autre dans le vertex. 
                    Sinon, la deformation sinus peut être faite ici aussi -> Prob Performances?
                    
Fragement Shader -> prendre les coordonés du fragement (le varying, check si y'a pas une constante), 
                    verifier le tracé du rayon de lumiere, calculer la nouvelle normale après la deformation. 
                    (cela donne la nouvelle couleur.)
                    Pour faire mieux, faut choisir les voisins correctement et les varier (si la deformation est
                    dans le fragement shader).
