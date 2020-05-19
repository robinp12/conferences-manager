<?php

namespace App\DataFixtures;

use App\Entity\Conference;
use App\Entity\User;
use DateTime;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;
use Faker\Provider\Lorem;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    /**
     * Encode password
     *
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_BE');

        $user = new User();
        $hash = $this->encoder->encodePassword($user, 'password');
        $user->setEmail("robin@hotmail.com");
        $user->setPassword($hash);
        $user->setLastName("Paquet");
        $user->setFirstName("Robin");
        $user->setIsAccepted(true);
        $manager->persist($user);

        $user = new User();
        $user->setEmail("simon.mohimont@hotmail.com");
        $user->setPassword($hash);
        $user->setLastName("Mohi");
        $user->setFirstName("Sim");
        $user->setIsAccepted(true);
        $manager->persist($user);

        $user = new User();
        $user->setEmail("gauthier@hotmail.com");
        $user->setPassword($hash);
        $user->setLastName("Boh");
        $user->setFirstName("Gauth");
        $user->setIsAccepted(false);
        $manager->persist($user);

        for($e=0;$e<10;$e++){
            $conference = new Conference();
            $conference->setName("Conference $faker->firstname")
            ->setStart(new DateTime())
            ->setDescription($faker->paragraph($nbSentences = 4));
            $manager->persist($conference);
        }
        $manager->flush();
    }
}
