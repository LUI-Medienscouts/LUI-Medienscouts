// auth.js

const SUPABASE_URL = 'https://yrqjgyjsivurlcrwnuhp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_9diy53NKbmLhqWWkynZ0mg_UMJgtB2e';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function verifyAuth(requiredEmail = null) {
    const { data: { session }, error } = await supabaseClient.auth.getSession();

    // Nicht eingeloggt? -> Zurueck zum Index
    if (error || !session) {
        window.location.replace('index.html');
        return null;
    }

    // Rechte-Check
    if (requiredEmail) {
        // Wir bereinigen beide E-Mails von versteckten Leerzeichen und Groß-/Kleinschreibung
        const currentUserMail = session.user.email.trim().toLowerCase();
        const neededMail = requiredEmail.trim().toLowerCase();

        if (currentUserMail !== neededMail) {
            // DIAGNOSE-MELDUNG: Zeigt ganz genau an, als wer du gerade fälschlicherweise eingeloggt bist!
            alert(`Zugriff verweigert!\n\nDu bist aktuell als "${currentUserMail}" eingeloggt.\nFür diese Seite wird aber "${neededMail}" benötigt.`);
            window.location.replace('index.html');
            return null;
        }
    }

    // Wenn wir hier ankommen: User ist eingeloggt UND hat Rechte!
    document.body.style.visibility = 'visible';

    return session.user;
}

async function handleLogout() {
    await supabaseClient.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace('index.html');
}