<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Component\Validator\Constraints as Assert; // Symfony's built-in constraints
use Symfony\Component\Serializer\Annotation\Groups;



/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @ApiResource(
 *     normalizationContext={
 *      "groups"={"users_read"}
 *     }
 * )
 * @UniqueEntity("email", message="Un utilisateur ayant cette adresse email existe déjà")
 * @ApiFilter(SearchFilter::class , properties={"email": "exact", "isAccepted": "exact"})
 *
 */
class User implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"conferences_read", "users_read", "speakers_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     * @Assert\NotBlank(message="L'email doit être renseigné !")
     * @Assert\Email(message="L'adresse email doit avoir un format valide !")
     * @Groups({"users_read", "conferences_read"})
     */
    private $email;

    /**
     * @ORM\Column(type="json")
     * @Groups({"users_read"})
     *
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="L'utilisateur doit avoir un nom!")
     * @Assert\Length(min=2, minMessage="Le nom doit faire au moins 2 caractères", max=255, maxMessage="Le nom doit faire moins de 255 caractères")
     * @Groups({"conferences_read", "users_read", "speakers_read"})
     */
    private $lastName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="L'utilisateur doit avoir un prénom!")
     * @Assert\Length(min=2, minMessage="Le prénom doit faire au moins 2 caractères", max=255, maxMessage="Le prénom doit faire moins de 255 caractères")
     * @Groups({"conferences_read", "users_read", "speakers_read"})
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Length(min=3, minMessage="Le nom de la conférence doit faire entre 3 et 255 caractères", max=255, maxMessage="Le nom de la conférence doit faire entre 2 et 255 caractères")
     * @Groups({"users_read", "conferences_read"})
     */
    private $telephone;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Participant", mappedBy="user")
     */
    private $participants;


    /**
     * @ORM\Column(type="boolean")
     * @Groups({"users_read"})
     */
    private $isAccepted;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Comment", mappedBy="user")
     *
     */
    private $comments;

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
     * @ORM\OneToMany(targetEntity="App\Entity\Speaker", mappedBy="user", orphanRemoval=true)
     */
    private $speakers;

    public function __construct()
    {
        $this->isAccepted = false;
        $this->participants = new ArrayCollection();
        $this->comments = new ArrayCollection();
        $this->speakers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getTelephone(): ?string
    {
        return $this->telephone;
    }

    public function setTelephone(?string $telephone): self
    {
        $this->telephone = $telephone;

        return $this;
    }

    /**
     * @return Collection|Participant[]
     */
    public function getParticipants(): Collection
    {
        return $this->participants;
    }

    public function addParticipant(Participant $participant): self
    {
        if (!$this->participants->contains($participant)) {
            $this->participants[] = $participant;
            $participant->setUser($this);
        }

        return $this;
    }

    public function removeParticipant(Participant $participant): self
    {
        if ($this->participants->contains($participant)) {
            $this->participants->removeElement($participant);
            // set the owning side to null (unless already changed)
            if ($participant->getUser() === $this) {
                $participant->setUser(null);
            }
        }

        return $this;
    }


    public function getIsAccepted(): ?bool
    {
        return $this->isAccepted;
    }

    public function setIsAccepted(bool $isAccepted): self
    {
        $this->isAccepted = $isAccepted;

        return $this;
    }

    /**
     * @return Collection|Comment[]
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): self
    {
        if (!$this->comments->contains($comment)) {
            $this->comments[] = $comment;
            $comment->setUser($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): self
    {
        if ($this->comments->contains($comment)) {
            $this->comments->removeElement($comment);
            // set the owning side to null (unless already changed)
            if ($comment->getUser() === $this) {
                $comment->setUser(null);
            }
        }

        return $this;
    }

    public function getInamiNumber(): ?string
    {
        return $this->inamiNumber;
    }

    public function setInamiNumber(?string $inamiNumber): self
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

    /**
     * @return Collection|Speaker[]
     */
    public function getSpeakers(): Collection
    {
        return $this->speakers;
    }

    public function addSpeaker(Speaker $speaker): self
    {
        if (!$this->speakers->contains($speaker)) {
            $this->speakers[] = $speaker;
            $speaker->setUser($this);
        }

        return $this;
    }

    public function removeSpeaker(Speaker $speaker): self
    {
        if ($this->speakers->contains($speaker)) {
            $this->speakers->removeElement($speaker);
            // set the owning side to null (unless already changed)
            if ($speaker->getUser() === $this) {
                $speaker->setUser(null);
            }
        }

        return $this;
    }
}
