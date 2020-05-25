<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert; // Symfony's built-in constraints
use ApiPlatform\Core\Annotation\ApiSubresource;



/**
 * @ORM\Entity(repositoryClass="App\Repository\ConferenceRepository")
 * @ApiResource(
 *  normalizationContext={
 *      "groups"={"conferences_read"}
 *  },
 * )
 */
class Conference
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"conferences_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"conferences_read"})
     * @Assert\NotBlank(message="Le nom de la conférence est obligatoire")
     * @Assert\Length(min=3, minMessage="Le nom de la conférence doit faire entre 3 et 255 caractères", max=255, maxMessage="Le nom de la conférence doit faire entre 2 et 255 caractères")
     */
    private $name;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"conferences_read"})
     */
    private $description;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"conferences_read"})
     */
    private $start;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"conferences_read"})
     */
    private $end;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"conferences_read"})
     */
    private $room;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Participant", mappedBy="conference")
     * @Groups({"conferences_read"})
     */
    private $participants;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Comment", mappedBy="conference")
     * @Groups({"conferences_read"})
     */
    private $comments;

    /**
     * @ApiSubresource
     * @ORM\OneToMany(targetEntity="App\Entity\Speaker", mappedBy="conference", orphanRemoval=true)
     */
    private $speakers;

    public function __construct()
    {
        $this->participants = new ArrayCollection();
        $this->comments = new ArrayCollection();
        $this->speakers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getStart(): ?\DateTimeInterface
    {
        return $this->start;
    }

    public function setStart(\DateTimeInterface $start): self
    {
        $this->start = $start;

        return $this;
    }

    public function getEnd(): ?\DateTimeInterface
    {
        return $this->end;
    }

    public function setEnd(?\DateTimeInterface $end): self
    {
        $this->end = $end;

        return $this;
    }

    public function getRoom(): ?string
    {
        return $this->room;
    }

    public function setRoom(?string $room): self
    {
        $this->room = $room;

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
            $participant->setEvent($this);
        }

        return $this;
    }

    public function removeParticipant(Participant $participant): self
    {
        if ($this->participants->contains($participant)) {
            $this->participants->removeElement($participant);
            // set the owning side to null (unless already changed)
            if ($participant->getEvent() === $this) {
                $participant->setEvent(null);
            }
        }

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
            $comment->setConference($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): self
    {
        if ($this->comments->contains($comment)) {
            $this->comments->removeElement($comment);
            // set the owning side to null (unless already changed)
            if ($comment->getConference() === $this) {
                $comment->setConference(null);
            }
        }

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
            $speaker->setConference($this);
        }

        return $this;
    }

    public function removeSpeaker(Speaker $speaker): self
    {
        if ($this->speakers->contains($speaker)) {
            $this->speakers->removeElement($speaker);
            // set the owning side to null (unless already changed)
            if ($speaker->getConference() === $this) {
                $speaker->setConference(null);
            }
        }

        return $this;
    }
}
