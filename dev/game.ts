class Game {

  // Create Game instance
  private static instance: Game;

  private player1: Player;
  private zombies: Array<Zombie> = new Array();
  private objects: Array<GameObject> = new Array();
  private i: number = 0;
  private x: number = 0;

  // Private constructor Singleton
  private constructor() {
    this.player1 = new Player("player1", 100, 100);

    // Push zombies to array
    for (this.i = 0; this.i < 3; this.i++) {
      this.zombies.push(new Zombie(this.player1));
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

    // Update all zombies in array
    for (let zombie of this.zombies) {
      zombie.update();

      if (zombie.getRectangle().bottom - zombie.getRectangle().height > window.innerHeight) {
        zombie.reset();
      }
    }

    // Update all objects in array
    for (let object of this.objects) {
      object.update();

      if (object instanceof Food) {
        if (Util.checkCollision(this.player1.getRectangle(), object.getRectangle())) {
          //console.log("Collission player and food!");
          // Notify all zombies when player eats food and is stronger.
          this.player1.strongerPlayer();

          // Remove food element from DOM
          object.remove();

          // Remove food object from array
          let index = this.objects.indexOf(object);
          this.objects.splice(index, 1);
        }
      }

      if (object instanceof Rock) {
        if (Util.checkCollision(this.player1.getRectangle(), object.getRectangle())) {
          console.log("Collission player and rock!");
        }
      }
    }

    requestAnimationFrame(() => this.gameLoop());
  }

  // Check if Game object exists
  public static getInstance() {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }
}