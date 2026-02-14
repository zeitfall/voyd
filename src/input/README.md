```text
InputControlType.DISCRETE   : [Single Press (0  /  1)]
InputControlType.CONTINUOUS : [Single Press (0 ... 1)]

    - InputBinding : <Device/Path>;

InputControlType.AXIS :

    - InputBinding : <Device/Path>; // Ex. Joystick movement.

    - InputAxis1DBinding :
        - Positive : InputControl : <Device/Path>;
        - Negative : InputControl : <Device/Path>;

InputControlType.VECTOR_2 :

    - InputBinding : <Device/Path>; // Ex. Joystick movement.

    - InputAxis2DBinding :
        - Left  : InputControl : <Device/Path>;
        - Right : InputControl : <Device/Path>;
        - Up    : InputControl : <Device/Path>;
        - Down  : InputControl : <Device/Path>;

InputControlType.VECTOR_3 :

    - InputBinding : <Device/Path>; // Ex. Gyroscope rotation.

    - InputAxis3DBinding :
        - Left     : InputControl : <Device/Path>;
        - Right    : InputControl : <Device/Path>;
        - Up       : InputControl : <Device/Path>;
        - Down     : InputControl : <Device/Path>;
        - Forward  : InputControl : <Device/Path>;
        - Backward : InputControl : <Device/Path>;
```