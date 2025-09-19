package ivan.personal.tours.environment.port;

public interface IMailSender {
    void sendSimpleMail(String to, String subject, String text);
}
