/// <reference path="firstscreen.ts"/>

namespace Screens {
    export class GameScreen extends FirstScreen {

        private player1: Player;
        // private zombies: Array<Zombie> = new Array();
        private objects: Array<GameObject> = new Array();
        private i: number = 0;
        private x: number = 0;
        private zombieCounter: number = 3;

        // Private constructor Singleton
        constructor() {
            super('gamescreen');
            this.player1 = new Player("player1", 100, 100);

            // Push zombies to array
            for (this.i = 0; this.i < this.zombieCounter; this.i++) {
                for (this.i = 0; this.i < this.zombieCounter; this.i++) {                 
                    this.objects.push(new Zombie(this.player1));      
                }
            }

            // Push objects to array
            for (this.x = 0; this.x < 2; this.x++) {
                this.objects.push(new Food());
                this.objects.push(new Rock());
            }

            this.gameLoop();
        }

        private gameLoop() {
            // Update player
            this.player1.update();

            // Check when player wins
            if (this.zombieCounter == 0) {
                console.log("Player wins!");
            }

            // Update all zombies in array and check collisions
            for (let zombie of this.objects) {
                if (zombie instanceof Zombie) {
                    zombie.update();
                

                if (Util.checkCollision(this.player1.getRectangle(), zombie.getRectangle())) {
                    console.log("Collission player and zombie!");

                    // Subtract life
                    this.player1.life -= 1;

                    // Player to start position
                    this.player1.x = 100;
                    this.player1.y = 100;
                }

                for (let bullet of this.player1.bullets) {
                    if (Util.checkCollision(bullet.getRectangle(), zombie.getRectangle())) {
                    // Subtract zombieCounter
                    this.zombieCounter -= 1;

                    // Remove bullet and zombie element and object in array
                    bullet.remove();
                    zombie.remove();
                    let index = this.player1.bullets.indexOf(bullet);
                    this.player1.bullets.splice(index, 1);
                    let index2 = this.objects.indexOf(zombie);
                    this.objects.splice(index2, 1);
                    }
                }

                if (zombie.getRectangle().bottom > window.innerHeight - 5) {
                    zombie.reset();
                }
            }
            }

            // Update all objects in array and check collisions
            for (let object of this.objects) {
                object.update();

                if (object instanceof Food) {
                    if (Util.checkCollision(this.player1.getRectangle(), object.getRectangle())) {
                    // Notify all zombies when player eats food and is stronger.
                    this.player1.strongerPlayer();

                    // Add life
                    this.player1.life += 1;

                    // Remove food element from DOM
                    object.remove();

                    // Remove food object from array
                    let index = this.objects.indexOf(object);
                    this.objects.splice(index, 1);
                    }
                }

                if (object instanceof Rock) {
                    if (Util.checkCollision(this.player1.getRectangle(), object.getRectangle())) {
                        // Subtract life
                        this.player1.life -= 1;

                        // Player to start position
                        this.player1.x = 100;
                        this.player1.y = 100;
                    }
                }
            }

            // Game over when lives of player is 0
            if (this.player1.life == 0) {
                Game.getInstance().gameOver();
                this.player1.remove();
                for (let zombie of this.objects) {
                    if (zombie instanceof Zombie) {
                        zombie.remove();
                    }
                }
                for (let object of this.objects) {
                    object.remove();
                }
            }

            // Set lives to 0 when lives are less than 0
            if (this.player1.life < 0) {
                this.player1.life = 0;
            }

            document.getElementById('zombies').innerHTML = "Zombies: " + this.zombieCounter;

            requestAnimationFrame(() => this.gameLoop());
        }
    }
}