<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\UniqueConstraint;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;



/**
 * @ORM\Table(name="speaker", uniqueConstraints={
 *   @UniqueConstraint(name="speaker_unique",
 *     columns={"user_id", "conference_id"})
 *   }
 * )
 * @ApiResource(
 *     normalizationContext={
 *      "groups"={"speakers_read"}
 *  },
 * )
 * @ORM\Entity(repositoryClass="App\Repository\SpeakerRepository")
 */
class Speaker
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"speakers_read"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="speakers")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"speakers_read"})
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Conference", inversedBy="speakers")
     * @ORM\JoinColumn(nullable=false)
     */
    private $conference;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getConference(): ?Conference
    {
        return $this->conference;
    }

    public function setConference(?Conference $conference): self
    {
        $this->conference = $conference;

        return $this;
    }
}
