<?php


namespace App\Controller;


use App\Entity\Medecin;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserController extends AbstractController
{

    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    /**
     * @Route("/signup")
     * @param Request $request
     * @return JsonResponse
     */
    public function signup (Request $request){
        $data = $request->getContent();
        $data = json_decode($data, true);

        $user = new User();
        $user->setEmail($data["email"]);
        $user->setFirstName($data["firstName"]);
        $user->setLastName($data["lastName"]);
        $hash = $this->encoder->encodePassword($user, $data["password"]);
        $user->setPassword($hash);

        $this->getDoctrine()->getManager()->persist($user);
        $this->getDoctrine()->getManager()->flush();

        return $this->json("L'utilisateur a bien été créé");
    }


    /**
     * @Route("/getInfosUser/{id}")
     * @param int $id
     * @return JsonResponse
     */
    public function getInfosUser (int $id){
        $response = [];
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $id]);

        $response["idUser"] = $user->getId();
        $response["firstName"] = $user->getFirstName();
        $response["lastName"] = $user->getLastName();
        $response["telephone"] = $user->getTelephone();
        $response["email"] = $user->getEmail();
        $response["inamiNumber"] = $user->getInamiNumber();
        $response["speciality"] = $user->getSpeciality();

        return $this->json($response);
    }
}