const axios = require('axios');
const fs = require('fs');

async function scanUnusedWhatsAppNumbers(start, end) {
    console.log(`بدء المسح للأرقام من ${start} إلى ${end}...`);
    const unusedNumbers = [];
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

    for (let num = start; num <= end; num++) {
        const phone = `+966${num}`;
        const url = `https://api.whatsapp.com/send?phone=${phone}`;

        try {
            const response = await axios.get(url, {
                headers: { 'User-Agent': userAgent },
                timeout: 5000,
                maxRedirects: 5
            });

            // التحقق من استجابة الصفحة لتحديد ما إذا كان الرقم مسجلاً
            if (!response.data.includes('not-found') && !response.data.includes('not_registered')) {
                unusedNumbers.push(phone);
                console.log(`تم العثور على رقم غير مستخدم: ${phone}`);
            }
        } catch (error) {
            // تجاهل الأخطاء الاستثنائية أثناء المسح
        }
    }

    return unusedNumbers;
}

// تشغيل المسح للأرقام الثلاثية (مثال: 300 إلى 399)
(async () => {
    const start = 300;
    const end = 399;
    const foundUsers = await scanUnusedWhatsAppNumbers(start, end);

    if (foundUsers.length > 0) {
        console.log('\n--- قائمة الأرقام المستخرجة للاستخدام ---');
        foundUsers.forEach(num => console.log(num));
        
        // حفظ النتائج في ملف
        fs.writeFileSync('no_and_No.txt', foundUsers.join('\n'), 'utf8');
        console.log('\nتم حفظ الأرقام في ملف: no_and_No.txt');
    } else {
        console.log('لم يتم العثور على أرقام غير مستخدمة في هذا النطاق.');
    }
})();
