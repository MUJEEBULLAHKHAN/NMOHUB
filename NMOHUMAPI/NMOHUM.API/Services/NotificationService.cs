using Microsoft.EntityFrameworkCore;
using NMOHUM.API.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMOHUM.API.Services
{
    public class NotificationService
    {
        private readonly NMOHUMAuthenticationContext _context;

        public NotificationService(NMOHUMAuthenticationContext context)
        {
            _context = context;
        }

        public async Task<List<Notification>> GetNotificationsForUser(int employeeId)
        {
            return await _context.Notifications.Where(n => n.EmployeeId == employeeId && n.IsActive)
                .ToListAsync();
        }

        public async Task<Notification> CreateNotification(Notification notification)
        {
            try
            {
                _context.Notifications.Add(notification);
                await _context.SaveChangesAsync();
                return notification;
            }
            catch (System.Exception ex)
            {

            }
            return null;
        }

        public async Task<bool> MarkAsRead(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification != null)
            {
                notification.IsRead = true;
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
