# Church.IO Label Print

This is a tiny bit of software that allows the Church.IO Checkin System to print remotely to a DYMO LabelWriter controlled by a Raspberry Pi.

## Requirements

* 1 Raspberry Pi Model B with power adapter.
* An SSD card with at least 1 GB of storage.
* A network cable.
* A DYMO LabelWriter 450 (or compatible label printer) connected via USB.

## Setup

### 1. Get Raspbian

1. Download Raspbian "Wheezy" from [here](http://www.raspberrypi.org/downloads) (Choose Direct download YYYY-MM-DD-wheezy-raspbian.zip).
2. Copy the image to your SD card using your computer. There is [a guide here](http://elinux.org/RPi_Easy_SD_Card_Setup).
3. Insert the SD card into your Raspberry Pi and plug it in. Make sure the network cable is plugged in also.
4. SSH to your Pi: `ssh pi@192.168.1.21`. (To find your Pi's IP address, it is easiest to log into your router and look at the DHCP lease table.) The default password is "raspberry".
5. Change your password by typing `passwd` immediately after login.

### 2. Install Software

```
sudo aptitude install nodejs npm cups netpbm vim
sudo ln -s /usr/bin/nodejs /usr/local/bin/node
cd
mkdir church.io
cd church.io
git clone git://github.com/churchio/checkin-printer
cd checkin-printer
ps2pdf -dCompressPages=false label.ps
sudo npm install -g forever
sudo vim /etc/rc.local
```

Add the following to rc.local, just before exit;

```
sudo -u pi forever start -l /home/pi/church.io/checkin-printer/server.log -a /home/pi/church.io/checkin-printer/server.js
```

### 3. Configure CUPS

```
sudo vim /etc/cups/cupsd.conf
```

Change `Listen localhost:631` to `Listen 0.0.0.0:631`.

Add `Allow @LOCAL` to both the `<Location />` and `<Location /admin>` sections.

Restart cups: `sudo service cups restart`

Access the cups admin interface via the url: http://192.168.1.21:631/admin

Add the DYMO printer.

### 4. Test Everything

Now, restart your Pi by typing `sudo reboot`.

You can test your label by visiting this URL (assuming the IP address is 192.168.1.21):

http://192.168.1.21/print?ORGNAME=My+Church&FIRSTNAME=Tim&LASTNAME=Morgan

(Note: not all the fields will be completed, so you will see placeholder text in many places on the label.)

If a label does not get printed, go to the next section...

## Troubleshooting

Check the log:
```
cat /home/pi/church.io/checkin-printer/server.log
```

Test that CUPS can print to the printer via the web interface: http://192.168.1.21:631/admin. Click *Printers*, select your printer, click *Maintenance*, choose *Print Test Page*.
   
## Customizing the Labels

Edit the label.ps file to your liking, then convert to PDF:

```
cd /home/pi/church.io/checkin-printer
ps2pdf -dCompressPages=false label.ps
```

