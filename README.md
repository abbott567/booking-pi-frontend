# Room Bookings, Pi Frontent

This is the frontend application for the Raspberry Pi setup that connects to the [Booking API](https://github.com/gunjam/booking-api). If you don't have an instance of the the API hosted anywhere on the web, you will need to do that first.

### Step 1

You will need a Raspberry Pi running Node 7 that you can boot into Kiosk mode on startup. Follow these [Raspberry Pi Kiosk setup instructions](https://github.com/abbott567/raspberry-pi-kiosk) using this repo as the one you clone down.

### Step 2

Once you have the Pi running the kiosk setup, you will need to add an extra environment variable.

Open your server.service file:

```
sudo nano /etc/systemd/system/node-server.service
```

Below the line `Environment=NODE_ENV=production` add another environment variable that links to the URL of your API application. This will allow the PI to connect to the right database.

```
Environment=API_URL=http://url-to-your-booking-api.com
```

### Step 3

The PI uses the API by using the rooms ID from the MongoDB on the end of it's URL. For example, if your room looked like the following, then your url would be `http://localhost:4000/12345678`:

```
{
  id: '12345678',
  name: 'Discovery One'
}
```

So, open your autostart file:

```
nano /home/pi/.config/lxsession/LXDE-pi/autostart
```

And amend the following line by adding your room ID on the end:

```
@chromium-browser --kiosk --incognito http://localhost:4000/12345678
```

## Environment Variables

`API_URL` = The URL to your API application.
`PORT` = Defaults to 4000
