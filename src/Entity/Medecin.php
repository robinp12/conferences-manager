<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;


/**
 * @ORM\Entity(repositoryClass="App\Repository\MedecinRepository")
 * @ApiResource
 */
class Medecin
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;


    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"users_read"})
     */
    private $inamiNumber;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"users_read"})
     */
    private $speciality;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\User", inversedBy="medecin", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    public function getId(): ?int
    {
        return $this->id;
    }


    public function getInamiNumber(): ?int
    {
        return $this->inamiNumber;
    }

    public function setInamiNumber(int $inamiNumber): self
    {
        $this->inamiNumber = $inamiNumber;

        return $this;
    }

    public function getSpeciality(): ?string
    {
        return $this->speciality;
    }

    public function setSpeciality(?string $speciality): self
    {
        $this->speciality = $speciality;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
