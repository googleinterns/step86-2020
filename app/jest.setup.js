import React from "react";
// Material UI uses this function a lot.
// It throws errors on server side, which pollutes the Jest logs.
// solution: https://stackoverflow.com/questions/58070996/how-to-fix-the-warning-uselayouteffect-does-nothing-on-the-server
React.useLayoutEffect = React.useEffect;