<?php


namespace App\Controller;


use App\Entity\Medecin;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class UserController extends AbstractController
{
    /**
     * @Route("/acceptUser}")
     * @param Request $request
     * @return JsonResponse
     */
    public function acceptUser (Request $request){
        $data = $request->getContent();
        $data = json_decode($data, true);

        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $data['id']]);
        $user->setIsAccepted(true);

        $newMedecin = new Medecin();
        $newMedecin->setUser($user);

        $this->getDoctrine()->getManager()->persist($user);
        $this->getDoctrine()->getManager()->persist($newMedecin);
        $this->getDoctrine()->getManager()->flush();

        return $this->json("L'utilisateur a bien été accepté");
    }

    /**
     * @Route("/getInfosUser/{id}")
     * @param int $id
     * @return JsonResponse
     */
    public function getInfosUser (int $id){
        $response = [];
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $id]);
        $medecin = $user->getMedecin();

        if(!is_null($medecin)){
            $response["idMedecin"] = $medecin->getId();
            $response["inamiNumber"] = $medecin->getInamiNumber();
            $response["speciality"] = $medecin->getSpeciality();
        }
        
        $response["idUser"] = $user->getId();
        $response["firstName"] = $user->getFirstName();
        $response["lastName"] = $user->getLastName();
        $response["addresse"] = $user->getAddresse();
        $response["telephone"] = $user->getTelephone();
        $response["email"] = $user->getEmail();

        return $this->json($response);
    }
}