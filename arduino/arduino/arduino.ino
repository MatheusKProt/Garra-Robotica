#include <SPI.h>
#include <Ethernet.h>
#include <AccelStepper.h>

#define HALFSTEP 8

AccelStepper motor1(HALFSTEP, 46, 48, 47, 49);
AccelStepper motor2(HALFSTEP, 42, 44, 43, 45);
AccelStepper motor3(HALFSTEP, 38, 40, 39, 41);
AccelStepper motor4(HALFSTEP, 34, 36, 35, 37);

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xAD };
byte ip[] = {192, 168, 0, 150};

EthernetServer server(80);

String readString = String(30);

void setup(){
  Serial.begin(9600);
  
  Ethernet.begin(mac, ip);
  server.begin();

  motor1.setMaxSpeed(300.0);
  motor1.setAcceleration(20.0);
  motor1.moveTo(0);

  motor2.setMaxSpeed(300.0);
  motor2.setAcceleration(20.0);
  motor2.moveTo(0);

  motor3.setMaxSpeed(300.0);
  motor3.setAcceleration(20.0);
  motor3.moveTo(0);

  motor4.setMaxSpeed(300.0);
  motor4.setAcceleration(20.0);
  motor4.moveTo(0);

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
          String s = midString(readString, "=", " HTTP/1.1");
          Serial.println(s);
          if(readString.indexOf("rotation") > 0) {
            motor1.moveTo(s.toInt());
          } else if(readString.indexOf("elevation") > 0) { 
            motor2.moveTo(s.toInt());     
          } else if(readString.indexOf("extension") > 0) { 
            motor3.moveTo(s.toInt());     
          } else if(readString.indexOf("gripper") > 0) { 
            motor4.moveTo(s.toInt());     
          }
          client.println("HTTP/1.1 200 OK");
          client.println("Content-Type: application/json");
          client.println("");
          client.println("{}");
          client.stop();
          readString="";
        }
      }
    }
  }
  motor1.run();
  motor2.run();
  motor3.run();
  motor4.run();
}
