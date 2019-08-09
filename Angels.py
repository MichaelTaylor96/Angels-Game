import pygame
import random

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
        self.image = pygame.Surface((10, 40))
        self.image.fill(GREEN)
        self.rect = self.image.get_rect()
        self.rect.centerx = WIDTH / 2
        self.rect.bottom = HEIGHT - 10
        self.xspeed = 0
        self.xaccel = 0
        self.yspeed = 0
        self.yaccel = 1

    def update(self):
        self.xaccel = 0
        self.yaccel = 1
        keystate = pygame.key.get_pressed()
        if self.rect.left < 0:
            self.rect.left = 0
        if self.rect.right > 480:
            self.rect.right = 480
        if keystate[pygame.K_LEFT] and self.rect.left > 0:
            self.xaccel = -1
        elif keystate[pygame.K_RIGHT] and self.rect.right < 480:
            self.xaccel = 1
        else:
            self.xspeed = 0
        if self.rect.left <= 0:
            self.yspeed = 2
        if self.rect.right >= 480:
            self.yspeed = 2
        if keystate[pygame.K_SPACE] and self.rect.bottom == 590:
            self.yspeed = -20
        if keystate[pygame.K_SPACE] and self.rect.right >= 480:
            self.yspeed = -15
            self.xspeed = -15
        if keystate[pygame.K_SPACE] and self.rect.left <=0:
            self.yspeed = -15
            self.xspeed = 15
        self.yspeed += self.yaccel
        self.rect.y += self.yspeed
        self.xspeed += self.xaccel
        self.rect.x += self.xspeed
        if self.rect.bottom >= 590:
            self.rect.bottom = 590

class Mob(pygame.sprite.Sprite):
    def __init__(self):
        pygame.sprite.Sprite.__init__(self)
        self.image = pygame.Surface((10, 10))
        self.image.fill(RED)
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



all_sprites = pygame.sprite.Group()
mobs = pygame.sprite.Group()
player = Player()
all_sprites.add(player)
for i in range(2):
    m = Mob()
    all_sprites.add(m)
    mobs.add(m)

# Game Loop
running = True
while running:
    clock.tick(FPS)
    # Process Input
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Update
    all_sprites.update()

    # Draw / Render
    screen.fill(BLACK)
    all_sprites.draw(screen)
    pygame.display.flip()

pygame.quit()
