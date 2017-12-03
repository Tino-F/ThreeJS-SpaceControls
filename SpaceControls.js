'use strict';

THREE.SpaceControls = function ( camera, options ) {

  //Set the initial velocity and x, y, z intervals

  let upint,
    downint,
	  leftint,
	  rightint,
    forwardint,
    backint,
    endTime,
    full_rotation = Math.PI * 2,
    mouse_prev = { x: 0, y: 0 };

  this.velocity = {
    x: 0,
    y: 0,
    z: 0
  };

  this.camera = camera;
  this.camera.rotation.order = 'YXZ';

  //Set paramaters to class variables and set default values
  //Sensitivity, lookSensitivity, cb, and Acceleration

  if ( !options ) {

    this.Sensitivity = 0.8;
    this.cb = () => {};
    this.Acceleration = 0.0003;
    this.maxSpeed = 0.1;

  } else {

    if ( !options.Sensitivity ) {

      this.Sensitivity = 0.8;

    } else {

      this.Sensitivity = options.Sensitivity;

    }

    if ( !options.cb ) {

      this.cb = () => {};

    } else {

      this.cb = options.cb;

    }

    if ( !options.Acceleration ) {

      this.Acceleration = 0.005;

    } else {

      this.Acceleration = options.Acceleration;

    }

    if ( !options.maxSpeed ) {
      this.maxSpeed = 1;
    } else {
      this.maxSpeed = options.maxSpeed;
    }

  }

  this.getTime = () => {
    let now = new Date();
    let now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getMilliseconds());
    return now_utc.getTime();
  };

  this.startTime = this.getTime();

  //Camera rotation algorithm on mouse movement

  document.addEventListener('mousemove', ( evnt ) => {

      let e = window.event ? window.event : evnt;


    	this.camera.rotation.x += ( ( mouse_prev.y - e.clientY ) * 0.01 ) * this.Sensitivity;
    	this.camera.rotation.y += ( ( mouse_prev.x - e.clientX ) * -0.01 ) * this.Sensitivity;

    	mouse_prev = {x: e.clientX, y: e.clientY};

  });

  this.checkSpeed = ( directionVector ) => {

    let moveon = true;
    let maxNegative = this.maxSpeed * -1;

    console.log( 'Checking speed Vector...' );

    if ( ( this.velocity.x + ( directionVector.x * this.Acceleration ) ) > this.maxSpeed ) {
      console.log( 'X:', ( this.velocity.x + ( directionVector.x * this.Acceleration ) ) );
      console.log( false );
      this.velocity.x = this.maxSpeed;
      moveon = false;
    } else if ( ( this.velocity.y + ( directionVector.y * this.Acceleration ) ) > this.maxSpeed ) {
      console.log( 'Y:', ( this.velocity.y + ( directionVector.y * this.Acceleration ) ) );
      console.log( false );
      this.velocity.y = this.maxSpeed;
      moveon = false;
    } else if ( ( this.velocity.z + ( directionVector.z * this.Acceleration ) ) > this.maxSpeed ) {
      console.log( 'Z:', ( this.velocity.z + ( directionVector.z * this.Acceleration ) ) );
      console.log( false );
      this.velocity.z = this.maxSpeed;
      moveon = false;
    } else if ( ( this.velocity.x - ( directionVector.x * this.Acceleration ) ) < maxNegative ) {
      console.log( 'X:', ( this.velocity.x - ( directionVector.x * this.Acceleration ) ) );
      console.log( false );
      this.velocity.x = maxNegative;
      moveon = false;
    } else if ( ( this.velocity.y - ( directionVector.y * this.Acceleration ) ) < maxNegative ) {
      console.log( 'Y:', ( this.velocity.y - ( directionVector.y * this.Acceleration ) ) );
      console.log( false );
      this.velocity.y = maxNegative;
      moveon = false;
    } else if ( ( this.velocity.z - ( directionVector.z * this.Acceleration ) ) < maxNegative ) {
      console.log( 'Z:', ( this.velocity.z - ( directionVector.z * this.Acceleration ) ) );
      console.log( false );
      this.velocity.z = maxNegative;
      moveon = false;
    }

    return moveon;

  }

  this.checkSpeedArray = ( directionVectorArray ) => {

    let moveon = true;
    let maxNegative = this.maxSpeed * -1;

    if ( ( this.velocity.x + ( directionVectorArray[0] * this.Acceleration ) ) > this.maxSpeed ) {

      this.velocity.x = this.maxSpeed;
      moveon = false;

    } else if ( ( this.velocity.y + ( directionVectorArray[1] * this.Acceleration ) ) > this.maxSpeed ) {

      this.velocity.y = this.maxSpeed;
      moveon = false;

    } else if ( ( this.velocity.z + ( directionVectorArray[2] * this.Acceleration ) ) > this.maxSpeed ) {

      this.velocity.z = this.maxSpeed;
      moveon = false;

    } else if ( ( this.velocity.x - ( directionVectorArray[0] * this.Acceleration ) ) < maxNegative ) {

      this.velocity.x = maxNegative;
      moveon = false;

    } else if ( ( this.velocity.y - ( directionVectorArray[1] * this.Acceleration ) ) < maxNegative ) {

      this.velocity.y = maxNegative;
      moveon = false;

    } else if ( ( this.velocity.z - ( directionVectorArray[2] * this.Acceleration ) ) < maxNegative ) {

      this.velocity.z = maxNegative;
      moveon = false;

    }

    return moveon;

  };

  this.updateVelocity = () => {

      let direction = this.camera.getWorldDirection();

      console.log( 'Attempting to move forward' );
      console.log( this.checkSpeed( direction ) );

      if( this.checkSpeed( direction ) ) {

        console.log( 'You are below your maximum speed. Accelerating.' );

        this.velocity.x += direction.x * this.Acceleration;
        this.velocity.y += direction.y * this.Acceleration;
        this.velocity.z += direction.z * this.Acceleration;
        this.cb( { Velocity: this.velocity, startTime: this.startTime, position: camera.position, Rotation: camera.rotation });
        this.update();

        console.log( this.velocity );

      }

  };

  this.updateReverseVelocity = () => {
    let direction = this.camera.getWorldDirection();

    if( this.checkSpeed( direction ) ) {

      this.velocity.x -= direction.x * this.Acceleration;
      this.velocity.y -= direction.y * this.Acceleration;
      this.velocity.z -= direction.z * this.Acceleration;
      this.cb( { Velocity: this.velocity, startTime: this.startTime, position: camera.position, Rotation: camera.rotation });
      this.update();

    }

  };

  this.accelerateUp = () => {

    let direction = this.camera.getWorldDirection();
    let rightcross = math.cross( [direction.x, direction.y, direction.z], [0, 1, 0] );
    let upcross = math.cross( rightcross, [direction.x, direction.y, direction.z] );

    if ( this.checkSpeedArray( upcross ) ) {

      this.velocity.x -= upcross[0] * this.Acceleration;
      this.velocity.y -= upcross[1] * this.Acceleration;
      this.velocity.z -= upcross[2] * this.Acceleration;
      this.cb( { Velocity: this.velocity, startTime: this.startTime, position: camera.position, Rotation: camera.rotation });
      this.update();

    }

  }

  this.accelerateDown = () => {

    let direction = this.camera.getWorldDirection();
    let rightcross = math.cross( [direction.x, direction.y, direction.z], [0, 1, 0] );
    let upcross = math.cross( rightcross, [direction.x, direction.y, direction.z] );

    if ( this.checkSpeedArray( upcross ) ) {

      this.velocity.x += upcross[0] * this.Acceleration;
      this.velocity.y += upcross[1] * this.Acceleration;
      this.velocity.z += upcross[2] * this.Acceleration;
      this.cb( { Velocity: this.velocity, startTime: this.startTime, position: camera.position, Rotation: camera.rotation });
      this.update();

    }

  }

  this.accelerateLeft = () => {

    let direction = this.camera.getWorldDirection();
    let rightcross = math.cross( [direction.x, direction.y, direction.z], [0, 1, 0] );

    if ( this.checkSpeedArray( rightcross ) ) {

      this.velocity.x -= rightcross[0] * this.Acceleration;
      this.velocity.y -= rightcross[1] * this.Acceleration;
      this.velocity.z -= rightcross[2] * this.Acceleration;
      this.cb( { Velocity: this.velocity, startTime: this.startTime, position: camera.position, Rotation: camera.rotation });
      this.update();

    }

  }

  this.accelerateRight = () => {

    let direction = this.camera.getWorldDirection();
    let rightcross = math.cross( [direction.x, direction.y, direction.z], [0, 1, 0] );

    if ( this.checkSpeedArray( rightcross ) ) {

      this.velocity.x += rightcross[0] * this.Acceleration;
      this.velocity.y += rightcross[1] * this.Acceleration;
      this.velocity.z += rightcross[2] * this.Acceleration;
      this.cb( { Velocity: this.velocity, startTime: this.startTime, position: camera.position, Rotation: camera.rotation });
      this.update();

    }

  }

  document.addEventListener('keydown', ( evnt ) => {

  	//let evnt = window.event ? window.event : e;

    let negativeMax = this.maxSpeed * -1;

    /*
    switch ( evnt.keyCode ) {
      case 70:
        console.log('R down');
      case 82:
        console.log('F down');
      case 87:
        console.log('W down');
      case 83:
        console.log('S down');
      case 68:
        console.log('D down');
      case 65:
        console.log('A down');
    };
    */

  	if ( evnt.keyCode === 70 ) {
  		//R

  		if ( !upint ) {
        //if the button isn't already being pressed
  			upint = setInterval(() => {

          this.accelerateUp();

        }, 10);

  		}

  	}

  	if ( evnt.keyCode === 82 ) {
  		//F
  		if ( !downint ) {

  			downint = setInterval(() => {

  				this.accelerateDown();

  			}, 10);

  		}
  	}

  	if ( evnt.keyCode === 87 ) {
  		//W
  		if ( !forwardint ) {

  			forwardint = setInterval(() => {

          this.updateVelocity();

  			}, 10);

  		}
  	}

  	if( evnt.keyCode === 83 ) {
  		//S
  		if ( !backint ) {

  			backint = setInterval(() => {

          this.updateReverseVelocity();

  			}, 10);

  		}
  	}

  	if ( evnt.keyCode === 68 ) {
  		//D
  		if ( !rightint ) {

  			rightint = setInterval(() => {

          this.accelerateRight();

  			}, 10);

  		}
  	}

  	if( evnt.keyCode === 65 ) {
  		//A
  		if ( !leftint ) {

  			leftint = setInterval(() => {

          this.accelerateLeft();

  			}, 10);

  		}
  	}

  });

  document.addEventListener('keyup', ( evnt ) => {
  	//let evnt = window.event ? window.event : e;

    /*
    console.log( evnt.keyCode );

    switch ( evnt.keyCode ) {
      case 70:
        console.log('R up');
      case 82:
        console.log('F up');
      case 87:
        console.log('W up');
      case 83:
        console.log('S up');
      case 68:
        console.log('D up');
      case 65:
        console.log('A up');
    };
    */

  	if ( evnt.keyCode === 70 ) {
  		//R
  		clearInterval( upint );
  		upint = false;

  	}

  	if( evnt.keyCode === 82 ) {
  		//F
  		clearInterval( downint );
  		downint = false;

  	}

  	if ( evnt.keyCode === 87 ) {
  		//W
  		clearInterval( forwardint );
  		forwardint = false;

  	}

  	if( evnt.keyCode === 83 ) {
  		//S
  		clearInterval( backint );
  		backint = false;

  	}

  	if( evnt.keyCode === 65 ) {
  		//A
  		clearInterval( leftint );
  		leftint = false;

  	}

  	if( evnt.keyCode === 68 ) {
  		//D
  		clearInterval( rightint );
  		rightint = false;

  	}

  });

  this.update = () => {

    let timeDifference = this.getTime() - this.startTime;
    camera.position.x += timeDifference * this.velocity.x;
    camera.position.y += timeDifference * this.velocity.y;
    camera.position.z += timeDifference * this.velocity.z;
    this.startTime = this.getTime();

  }

};
