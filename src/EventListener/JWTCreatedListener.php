<?php


namespace App\EventListener;


use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;


class JWTCreatedListener
{

    /**
     * @param JWTCreatedEvent $event
     *
     * @return void
     * @throws \Exception
     */
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $user = $event->getUser();
        $expiration = new \DateTime('+1 day');
        $expiration->setTime(2, 0, 0);

        $payload = $event->getData();
        $payload['exp'] = $expiration->getTimestamp();
        $payload['id'] = $user->getId();

        $event->setData($payload);
    }
}