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

Testing for multiple users can only be done from different IPs.
The online users list might not be accurate if a user opens ChatApp
on multiple tabs or windows from the same IP.
