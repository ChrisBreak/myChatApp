Cristhian Sotelo-Plaza

Simple chat application, handles multiple users.

Installs needed:
npm install express --save
npm install body-parser --save
npm install ejs --save
npm install cookie-parser --save
npm install express-session --save
npm install socket.io --save

ChatApp uses memory to store user information.
On the client side, a cookie stores user information for 24hrs.
message input:
/nick name, changes user name, if it's unique.
/nickcolor RRGGBB, changes user color.
