#include <SPI.h>
#include <Ethernet.h>
#include <Stepper.h>

#define passosPorVolta 500

Stepper motor1(passosPorVolta, 38, 40, 39, 41);
Stepper motor2(passosPorVolta, 42, 44, 43, 45);
Stepper motor3(passosPorVolta, 46, 48, 47, 49);
Stepper motor4(passosPorVolta, 50, 52, 51, 53);

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
byte ip[] = {192, 168, 1, 150};

EthernetServer server(80);

String readString = String(30);

void setup(){
  Serial.begin(9600);
  
  Ethernet.begin(mac, ip);
  server.begin();

  motor1.setSpeed(70);
  motor2.setSpeed(70);
  motor3.setSpeed(70);
  motor4.setSpeed(70);
  Serial.println("OK");
}

String midString(String str, String start, String finish){
  int locStart = str.indexOf(start);
  if (locStart==-1) return "";
  locStart += start.length();
  int locFinish = str.indexOf(finish, locStart);
  if (locFinish==-1) return "";
  return str.substring(locStart, locFinish);
}

void loop(){
  EthernetClient client = server.available();
  if (client) {
    while (client.connected()) {
      if (client.available()) {
      char c = client.read();
        if (readString.length() < 100) {
          readString += c;
        }
        if (c == '\n') { 
//          client.println("HTTP/1.1 200 OK");
//          client.println("Content-Type: application/json");
//          client.println("");
//          client.println("{}");
          client.stop();
          String s = midString(readString, "=", " HTTP/1.1");
          Serial.println(s);
          if(readString.indexOf("rotation") > 0) {
            motor1.step(s.toInt());
          } else if(readString.indexOf("elevation") > 0) { 
            motor2.step(s.toInt());     
          } else if(readString.indexOf("extension") > 0) { 
            motor3.step(s.toInt());     
          } else if(readString.indexOf("gripper") > 0) { 
            motor4.step(s.toInt());     
          }
          readString="";
        }
      }
    }
  }
}
