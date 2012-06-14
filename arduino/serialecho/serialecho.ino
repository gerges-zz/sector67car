#include "Arduino.h"

  boolean hasData = false;
  int leng=0; //provides the length of the char array
  char inChar; // Where to store the character read
  unsigned char inData[140]; 
  byte index = 0;
/* -----------------------------------------------------------------  */
/** MAIN program Setup
 */
void setup() {
  Serial.begin(9600);
}


unsigned char* serialReadStr() {
  while (Serial.available() > 0) {
      inChar = Serial.read(); // Read a character
      inData[index] = inChar; // Store it
      index++; // Increment where to write next
      inData[index] = '\0'; // Null terminate the string
      hasData = true;
    }
    
    return inData;
}

/* -----------------------------------------------------------------  */
/** MAIN program Loop
 */

void loop() {
   unsigned char* serialStr = serialReadStr();
   if (hasData == true) {
     Serial.write((char *)serialStr); 
   }
   index = 0;
   hasData = false;
}
