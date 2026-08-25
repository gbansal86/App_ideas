# Chat Transcript — RouterVault Idea

Date range: 2026-08-14 to 2026-08-25

> Sanitization note: router serial number and all visible/masked passwords are intentionally omitted. Screenshots are described rather than copied.

---

## User

Can you create a batch script or PowerShell script to configure DDNS under `Advanced > Application > DDNS`, and set up USB Application / Media Sharing using FTP/Samba? First show where I can see these settings.

## Assistant

Explained that the exact Huawei model and ISP firmware determine whether DDNS and USB-sharing menus are exposed. Directed the user to open `http://192.168.100.1`, sign in with administrator credentials, and look under Advanced/Application or Network Application. Also noted that a universal script is unsafe until the firmware-specific login and configuration API are known.

## User

Uploaded the Huawei router Device Information screen and asked, “where”.

Screenshot observations:

- Device type: Huawei EchoLife HG8145V5
- Firmware family: V5R019C00S107
- ISP customization: Bharti
- Top navigation includes Status, WAN, LAN, IPv6, WLAN, Security, Route, Forward Rules, Network Application, Voice, and System Tools.
- Sensitive device serial number omitted.

## Assistant

Directed the user to click **Network Application**, then look for DDNS Configuration, USB Application, storage sharing, FTP, or Samba. Warned that ISP-managed firmware or a limited login may hide some menus.

## User

Uploaded the `Network Application > USB Application` page.

Screenshot observations:

- FTP Client Configuration section with FTP URL, port, username, password, path, and Download.
- FTP Server Configuration section with Enable FTP Server, username, password, port, USB Device, Root Path, and Apply.
- USB Device currently displayed `No USB Device`.
- Credentials omitted.

## Assistant

Explained that the USB drive must first be inserted and detected. Recommended:

1. Insert the USB drive.
2. Wait and refresh.
3. Enable FTP Server.
4. Create a separate FTP username and strong password.
5. Keep port 21 for LAN-only use.
6. Select the detected USB device and root path.
7. Apply.
8. Access it locally at `ftp://192.168.100.1`.

Clarified that the upper FTP Client section downloads from another FTP server onto the router USB drive, while the lower FTP Server section shares the attached drive. Warned not to expose unencrypted FTP to the WAN.

## User

Can I delete or copy files there then?

## Assistant

Explained that the FTP account should normally allow viewing, downloading, uploading, creating folders, renaming, and deleting, but ISP firmware may enforce read-only behavior. Recommended testing with a harmless file and using WinSCP Portable or FileZilla Portable for more reliable file management without administrator installation.

Suggested connection settings:

- Protocol: FTP
- Host: `192.168.100.1`
- Port: `21`
- Username/password: the separate FTP credentials created on the router
- Encryption: none, therefore trusted LAN only

Also advised disabling access or safely ejecting before physically removing storage.

## User

How much speed will I get?

## Assistant

Estimated typical actual FTP performance:

| Connection | Likely actual speed |
|---|---:|
| Gigabit Ethernet | 5–15 MB/s |
| 5 GHz Wi-Fi near router | 4–12 MB/s |
| 2.4 GHz Wi-Fi | 2–6 MB/s |

Approximate transfer time at 10 MB/s:

- 1 GB: about 1 minute 40 seconds
- 10 GB: about 17 minutes
- 50 GB: about 1 hour 25 minutes

Explained that the router CPU and FTP implementation are usually the bottlenecks. Local transfers do not depend on internet speed.

## User

Can you save this idea in App_ideas along with chat?

## Result

Saved this sanitized transcript and the detailed product idea in:

`RouterVault_Huawei_DDNS_USB_Manager/`
