import pygame
import random
import math

WIDTH = 480
HEIGHT = 600
FPS = 60

# define colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)

# initializing pygame and create window
pygame.init()
pygame.mixer.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Angels")
clock = pygame.time.Clock()

class Player(pygame.sprite.Sprite):
    def __init__(self):
        pygame.sprite.Sprite.__init__(self)
        self.og_image = pygame.transform.scale(pygame.image.load("img/AngelsGuy.png").convert(), (28, 58))
        self.image = self.og_image
        self.angle = 0
        self.rect = self.image.get_rect()
        self.rect.centerx = WIDTH / 2
        self.rect.bottom = HEIGHT - 10
        self.xspeed = 0
        self.xaccel = 0
        self.yspeed = 0
        self.yaccel = .5

    def update(self):
        self.xaccel = 0
        self.yaccel = .5
        keystate = pygame.key.get_pressed()
        if self.rect.left < 0:
            self.rect.left = 0
        if self.rect.right > 480:
            self.rect.right = 480
        if keystate[pygame.K_LEFT]:
            if self.rect.bottom == 590 and self.rect.left > 0:
                if self.xspeed > -5:
                    self.xspeed -= .3
            else:
                self.image = pygame.transform.rotate(self.og_image, self.angle)
                self.angle += 8 % 360
        elif keystate[pygame.K_RIGHT]:
            if self.rect.bottom == 590 and self.rect.left < 480:
                if self.xspeed < 5:
                    self.xspeed += .3
            else:
                self.image = pygame.transform.rotate(self.og_image, self.angle)
                self.angle -= 8 % 360
        elif self.rect.bottom == 590:
            self.xspeed = 0
        if self.rect.bottom == 590 and self.angle != 0:
            self.image = self.og_image
            self.angle = 0
        if keystate[pygame.K_SPACE] and self.rect.bottom == 590:
            self.yspeed = -13
        if keystate[pygame.K_SPACE] and self.rect.right >= 480:
            self.yspeed = -13
            self.xspeed = -3
        if keystate[pygame.K_SPACE] and self.rect.left <=0:
            self.yspeed = -13
            self.xspeed = 3
        self.yspeed += self.yaccel
        self.rect.y += self.yspeed
        self.xspeed += self.xaccel
        self.rect.x += self.xspeed
        if self.rect.bottom >= 590:
            self.rect.bottom = 590

class Mob(pygame.sprite.Sprite):
    def __init__(self):
        pygame.sprite.Sprite.__init__(self)
        self.image = pygame.Surface((20, 20))
        self.image.fill(GREEN)
        self.rect = self.image.get_rect()
        self.rect.x = random.randrange(WIDTH - self.rect.width)
        self.rect.y = 530
        self.yspeed = 0
        self.yaccel = -.02

    def update(self):
        self.rect.y += self.yspeed
        self.yspeed += self.yaccel
        if self.yspeed <= -3:
            self.yaccel = 0

class Hook(pygame.sprite.Sprite):
    def __init__(self, x, y, angle):
        pygame.sprite.Sprite.__init__(self)
        self.image = pygame.Surface((15, 15))
        self.image.fill(RED)
        self.rect = self.image.get_rect()
        self.rect.x = x
        self.rect.y = y
        self.angle = angle
        self.xspeed = math.cos(self.angle*(math.pi/180))*10
        self.yspeed = math.sin(self.angle*(math.pi/180))*10

    def update(self):
        self.rect.y -= self.yspeed
        self.rect.x += self.xspeed


all_sprites = pygame.sprite.Group()
mobs = pygame.sprite.Group()
player = Player()
all_sprites.add(player)
for i in range(2):
    m = Mob()
    all_sprites.add(m)
    mobs.add(m)
time = 0

# Game Loop
running = True
while running:
    keystate = pygame.key.get_pressed()
    clock.tick(FPS)
    time += 1

    if time % 60 == 0:
        m = Mob()
        all_sprites.add(m)
        mobs.add(m)
    # Process Input

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN and event.key == pygame.K_w:
            hook = Hook(player.rect.x+10, player.rect.y+20, player.angle)
            all_sprites.add(hook)

    # Update
    all_sprites.update()

    # Draw / Render
    screen.fill(BLACK)
    all_sprites.draw(screen)
    pygame.display.flip()

pygame.quit()
